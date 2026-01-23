import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: Array<{ name: string; value: string; options?: any }>) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Cambios en cookies no-server components, ignorar
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const appointmentId = params.id;
    const userId = user.id;

    // Verificar que el usuario tiene acceso a esta cita
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('patient_id, psychologist_id')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      );
    }

    const hasAccess =
      appointment.patient_id === userId ||
      appointment.psychologist_id === userId;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a esta cita' },
        { status: 403 }
      );
    }

    // Obtener mensajes
    const { data: messages, error: messagesError } = await supabase
      .from('appointment_messages')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      return NextResponse.json(
        { error: 'Error al obtener mensajes' },
        { status: 500 }
      );
    }

    return NextResponse.json(messages || []);
  } catch (error) {
    console.error('Error en GET /api/appointments/[id]/messages:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: Array<{ name: string; value: string; options?: any }>) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Cambios en cookies no-server components, ignorar
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const appointmentId = params.id;
    const userId = user.id;
    const { message } = await request.json();

    // Validaciones
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'El mensaje es requerido' },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'El mensaje no puede exceder 500 caracteres' },
        { status: 400 }
      );
    }

    // Verificar acceso a la cita
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('patient_id, psychologist_id')
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404 }
      );
    }

    const hasAccess =
      appointment.patient_id === userId ||
      appointment.psychologist_id === userId;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'No tienes permiso para enviar mensajes en esta cita' },
        { status: 403 }
      );
    }

    // Insertar mensaje
    const { data: newMessage, error: insertError } = await supabase
      .from('appointment_messages')
      .insert({
        appointment_id: appointmentId,
        sender_id: userId,
        message: message.trim(),
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Error al guardar el mensaje' },
        { status: 500 }
      );
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/appointments/[id]/messages:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
