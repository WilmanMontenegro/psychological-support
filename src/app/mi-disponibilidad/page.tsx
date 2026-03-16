import type { Metadata } from 'next'
import PracticePauseNotice from '@/components/PracticePauseNotice'

export const metadata: Metadata = {
  title: 'Disponibilidad en pausa temporal | Tu Psico Ana',
  description:
    'La configuración de disponibilidad clínica está temporalmente pausada mientras el sitio opera como marca personal y blog.',
}

export default function MiDisponibilidadPage() {
  return <PracticePauseNotice title="Disponibilidad clínica temporalmente pausada" />
}
