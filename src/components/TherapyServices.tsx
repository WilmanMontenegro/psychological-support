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
    description: "Acompañamiento empático y profesional para volver a conectar con la motivación, la esperanza y el sentido de vida."
  },
  {
    icon: <FaUsers className="w-12 h-12 text-white" />,
    title: "Ansiedad",
    description: "Espacio para identificar y gestionar pensamientos, emociones y comportamientos asociados a la ansiedad, fortaleciendo la calma interior."
  },
  {
    icon: <FaEye className="w-12 h-12 text-white" />,
    title: "Manejo de Emociones",
    description: "Te ayudo a desarrollar tus habilidades para reconocer, comprender y expresar las emociones de forma saludable."
  },
  {
    icon: <FaUserTie className="w-12 h-12 text-white" />,
    title: "Autoestima",
    description: "Aquí el trabajo está enfocado en la autovaloración, el amor propio y la confianza personal."
  },
  {
    icon: <FaHandsHelping className="w-12 h-12 text-white" />,
    title: "Crecimiento Personal y Bienestar Integral",
    description: "Buscamos las herramientas prácticas que fortalecen la resiliencia, la autocomprensión y la construcción para una vida más equilibrada.."
  }
]

export default function TherapyServices() {
  return (
    <section className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent mb-4">
            Servicios de Acompañamiento
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