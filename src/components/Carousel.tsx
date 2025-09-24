"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CarouselProps {
  images: {
    src: string
    alt: string
    title?: string
    description?: string
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
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg">
      {/* Imágenes */}
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
              priority={index === 0}
            />
            {(image.title || image.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                {image.title && (
                  <h3 className="text-white text-xl font-montserrat font-semibold mb-2">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-white/90 font-lato">
                    {image.description}
                  </p>
                )}
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Imagen anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label="Imagen siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
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