import { NextResponse } from 'next/server'

const pausedResponse = {
  error: 'Esta funcionalidad no está disponible en este momento.'
}

export async function GET() {
  return NextResponse.json(pausedResponse, { status: 503 })
}

export async function POST() {
  return NextResponse.json(pausedResponse, { status: 503 })
}
