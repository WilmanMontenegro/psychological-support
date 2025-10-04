"use client"

import { FaBrain, FaHeart, FaUsers, FaEye, FaUserTie, FaHandsHelping } from 'react-icons/fa'
import ServiceCard from './ServiceCard'

const services = [
  {
    icon: <FaBrain className="w-12 h-12 text-white" />,
    title: "Manejo del Estrés",
    description: "Técnicas efectivas para reducir y manejar el estrés diario. Te ayudo a desarrollar herramientas para una vida más equilibrada y saludable."
  },
  {
    icon: <FaHeart className="w-12 h-12 text-white" />,
    title: "Depresión",
    description: "Acompañamiento profesional para superar episodios depresivos. Trabajamos juntos hacia tu bienestar emocional y mental."
  },
  {
    icon: <FaUsers className="w-12 h-12 text-white" />,
    title: "Relaciones",
    description: "Mejora tus vínculos interpersonales y comunicación. Fortalece tus relaciones familiares, de pareja y sociales."
  },
  {
    icon: <FaEye className="w-12 h-12 text-white" />,
    title: "Ansiedad",
    description: "Estrategias para controlar la ansiedad y los pensamientos intrusivos. Recupera tu tranquilidad y confianza interior."
  },
  {
    icon: <FaUserTie className="w-12 h-12 text-white" />,
    title: "Coaching Ejecutivo",
    description: "Desarrollo de habilidades de liderazgo y gestión emocional en el ámbito profesional para alcanzar tus objetivos."
  },
  {
    icon: <FaHandsHelping className="w-12 h-12 text-white" />,
    title: "Grupos de Apoyo",
    description: "Espacios seguros de crecimiento compartido. Conecta con otros en procesos similares y fortalece tu red de apoyo."
  }
]

export default function TherapyServices() {
  return (
    <section className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent mb-4">
            Terapias y Tratamientos
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 font-lato max-w-2xl mx-auto">
            Ofrezco servicios especializados adaptados a tus necesidades específicas.
            Cada sesión está diseñada para brindarte las herramientas necesarias para tu bienestar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}