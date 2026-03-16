import type { Metadata } from 'next'
import PracticePauseNotice from '@/components/PracticePauseNotice'

export const metadata: Metadata = {
  title: 'Servicios en pausa temporal | Tu Psico Ana',
  description:
    'El agendamiento de citas y el acompañamiento psicológico se encuentran temporalmente pausados. Sitio activo como marca personal y blog.',
}

export default function AgendarCitaPage() {
  return <PracticePauseNotice title="Agendamiento temporalmente pausado" />
}
