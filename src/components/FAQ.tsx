'use client'

import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "¿Cómo puedo agendar una cita?",
    answer: "Puedes agendar tu cita directamente a través del formulario disponible en esta página web. Solo debes ingresar tus datos y seleccionar el horario que mejor se ajuste a tu disponibilidad. Una vez enviada la solicitud, recibirás la confirmación con los detalles de tu sesión."
  },
  {
    question: "¿Cuánto dura una sesión de acompañamiento psicológico?",
    answer: "Las sesiones tienen una duración de entre 20 y 30 minutos, brindando un espacio de acompañamiento psicológico centrado en el bienestar emocional y personal. Cada encuentro se adapta a tus necesidades y ritmo, integrando herramientas prácticas para fortalecer la autoestima, la gestión emocional y el equilibrio interior."
  },
  {
    question: "¿Ofrecen acompañamiento psicológico presencial?",
    answer: "No, en el momento las sesiones de acompañamiento psicológico se realizan de manera virtual, lo que te permite acceder al proceso desde cualquier lugar con comodidad y privacidad. Es un espacio seguro y confidencial, ideal para quienes buscan cuidar su bienestar desde su entorno personal."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos transferencias bancarias, y tarjetas de débito/crédito. También manejamos planes de pago flexibles para facilitar el acceso a nuestros servicios terapéuticos."
  },
  {
    question: "¿Es confidencial la información compartida?",
    answer: "Sí, absolutamente. Toda la información compartida durante las sesiones es estrictamente confidencial. El acompañamiento se realiza bajo el principio ético del secreto profesional y en cumplimiento de las normas legales que protegen tu privacidad y bienestar."
  }
]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent mb-4 text-center">
        Preguntas Frecuentes
      </h2>
      <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-12"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="order-1 lg:order-1">
          <div className="relative">
            <img
              src="/images/FAQ.jpg"
              alt="Sesión de terapia profesional"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="order-2 lg:order-2">

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openItems.includes(index) ? (
                      <FaChevronUp className="h-5 w-5" style={{color: 'var(--color-secondary)'}} />
                    ) : (
                      <FaChevronDown className="h-5 w-5" style={{color: 'var(--color-secondary)'}} />
                    )}
                  </div>
                </button>

                {openItems.includes(index) && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}