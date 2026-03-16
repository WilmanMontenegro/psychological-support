'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "¿Para qué sirve esta página?",
    answer: "Este sitio comparte contenido educativo sobre bienestar emocional, reflexiones personales y artículos del blog."
  },
  {
    question: "¿Cómo puedo participar en la comunidad?",
    answer: "Puedes registrarte e iniciar sesión para comentar en los artículos y participar en las conversaciones del blog."
  },
  {
    question: "¿Ofrecen atención clínica o terapéutica?",
    answer: "No. Este sitio está enfocado en contenido educativo y comunidad digital."
  },
  {
    question: "¿Cómo puedo contactarte?",
    answer: "Puedes usar el formulario de contacto para consultas sobre contenido, colaboraciones y proyectos."
  },
  {
    question: "¿Qué pasa con mis datos?",
    answer: "El manejo de datos se rige por la política de privacidad del sitio. Puedes revisarla en la sección correspondiente."
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
            <Image
              src="/images/FAQ.jpg"
              alt="Preguntas frecuentes del sitio"
              width={960}
              height={640}
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="order-2 lg:order-2">

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md hover:border-secondary/30"
              >
                <button
                  className="w-full px-6 py-4 text-left bg-white hover:bg-pastel-light/30 transition-colors duration-200 flex items-center justify-between"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-lg font-medium text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <div className={`flex-shrink-0 transition-transform duration-700 ease-in-out ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                    {openItems.includes(index) ? (
                      <FaChevronUp className="h-5 w-5" style={{color: 'var(--color-secondary)'}} />
                    ) : (
                      <FaChevronDown className="h-5 w-5" style={{color: 'var(--color-secondary)'}} />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-700 ease-in-out ${
                    openItems.includes(index) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  style={{
                    transitionProperty: 'max-height, opacity'
                  }}
                >
                  <div className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}