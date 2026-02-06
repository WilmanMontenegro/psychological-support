import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Política de Privacidad | Acompañamiento Psicológico',
    description: 'Política de privacidad y tratamiento de datos personales.',
}

export default function PrivacyPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-libre-baskerville text-accent mb-8">Política de Privacidad</h1>

            <div className="prose prose-lg text-gray-700 font-montserrat">
                <p className="mb-4">
                    Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-secondary mb-4">1. Introducción</h2>
                    <p>
                        Bienvenido a <strong>Acompañamiento Psicológico con Ana Marcela Polo Bastidas</strong> (&quot;nosotros&quot;, &quot;nuestro&quot;).
                        Respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad le informará
                        sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y utiliza nuestros servicios de autenticación.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-secondary mb-4">2. Datos que recopilamos</h2>
                    <p>
                        Podemos recopilar, utilizar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Datos de Identidad:</strong> incluye nombre, apellidos, nombre de usuario o identificador similar.</li>
                        <li><strong>Datos de Contacto:</strong> incluye dirección de correo electrónico.</li>
                        <li><strong>Datos Técnicos:</strong> incluye dirección IP, datos de inicio de sesión, tipo y versión del navegador.</li>
                    </ul>
                    <p className="mt-4">
                        Al utilizar el inicio de sesión con <strong>Google</strong> o <strong>Facebook</strong>, recibimos su nombre y correo electrónico
                        exclusivamente para crear su perfil de usuario y permitirle gestionar sus citas y comentarios.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-secondary mb-4">3. Cómo usamos sus datos</h2>
                    <p>Solo utilizaremos sus datos personales cuando la ley lo permita. Principalmente, para:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>Registrarlo como nuevo usuario.</li>
                        <li>Gestionar sus citas y el servicio de acompañamiento psicológico.</li>
                        <li>Permitirle participar en funciones interactivas como comentarios en el blog.</li>
                        <li>Notificarle sobre cambios en nuestros términos o política de privacidad.</li>
                    </ul>
                </section>

                <section id="eliminacion-datos" className="mb-8 scroll-mt-24">
                    <h2 className="text-xl font-bold text-secondary mb-4">4. Eliminación de Datos (Data Deletion)</h2>
                    <p>
                        De acuerdo con las políticas de la Plataforma de Facebook y el RGPD, usted tiene derecho a solicitar la eliminación de sus datos.
                    </p>
                    <p className="mt-2 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <strong>Instrucciones para solicitar la eliminación de datos:</strong>
                        <br /><br />
                        1. Inicie sesión en su cuenta y vaya a &quot;Mi Perfil&quot;.
                        <br />
                        2. Busque la opción &quot;Eliminar mi cuenta&quot; (si está disponible) o contacte directamente con nosotros.
                        <br />
                        3. Alternativamente, envíe un correo electrónico a <strong>contacto@tupsicoana.com</strong> con el asunto &quot;Solicitud de Eliminación de Datos&quot;.
                        <br />
                        4. Procesaremos su solicitud y eliminaremos todos sus datos personales de nuestros servidores en un plazo máximo de 30 días.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-secondary mb-4">5. Seguridad de los datos</h2>
                    <p>
                        Hemos implementado medidas de seguridad adecuadas para evitar que sus datos personales se pierdan accidentalmente,
                        se utilicen o se acceda a ellos de forma no autorizada, se alteren o se divulguen.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold text-secondary mb-4">6. Contacto</h2>
                    <p>
                        Si tiene alguna pregunta sobre esta política de privacidad, por favor contáctenos a través de nuestro sitio web o por correo electrónico.
                    </p>
                </section>
            </div>
        </main>
    )
}
