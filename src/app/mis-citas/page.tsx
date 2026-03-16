import type { Metadata } from 'next'
import PracticePauseNotice from '@/components/PracticePauseNotice'

export const metadata: Metadata = {
  title: 'Citas en pausa temporal | Tu Psico Ana',
  description:
    'La gestión de citas está temporalmente pausada mientras la plataforma se enfoca en contenido de marca personal y blog.',
}

export default function MisCitasPage() {
  return <PracticePauseNotice title="Gestión de citas temporalmente pausada" />
}
