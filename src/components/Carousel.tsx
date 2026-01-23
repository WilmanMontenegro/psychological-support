"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CarouselProps {
  images: {
    src: string
    alt: string
    title?: string
    description?: string
    objectPosition?: number // Porcentaje de 0 a 100 para posición Y (50 = centrado)
  }[]
  autoSlideInterval?: number
  showDots?: boolean
  showArrows?: boolean
}

export default function Carousel({
  images,
  autoSlideInterval = 5000,
  showDots = true,
  showArrows = true
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, autoSlideInterval)

    return () => clearInterval(interval)
  }, [images.length, autoSlideInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] overflow-hidden max-w-full">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              style={{ objectPosition: `center ${image.objectPosition || 50}%` }}
              priority={index === 0}
            />
            {(image.title || image.description) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="text-center">
                  {image.title && (
                    <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-montserrat font-semibold mb-2 sm:mb-4">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-white/90 font-lato text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 px-4">
                      {image.description}
                    </p>
                  )}
                  <Link
                    href="https://tupsicoana.com/agendar-cita"
                    className="inline-block px-3 py-2 sm:px-4 sm:py-2 rounded text-white font-medium transition text-sm sm:text-base"
                    style={{ backgroundColor: 'var(--color-secondary)' }}
                  >
                    Hablemos
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flechas de navegación */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-1 sm:p-2 rounded-full transition-colors"
            aria-label="Imagen anterior"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-1 sm:p-2 rounded-full transition-colors"
            aria-label="Imagen siguiente"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores (dots) */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/70'
                }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}