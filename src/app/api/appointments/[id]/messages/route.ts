import { NextResponse } from 'next/server'

const pausedResponse = {
  error:
    'La funcionalidad de citas y acompañamiento psicológico está temporalmente pausada. Ana Marcela es psicóloga en formación.'
}

export async function GET() {
  return NextResponse.json(pausedResponse, { status: 503 })
}

export async function POST() {
  return NextResponse.json(pausedResponse, { status: 503 })
}
