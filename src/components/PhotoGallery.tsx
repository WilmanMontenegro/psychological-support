"use client"

import { useState } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import dynamic from 'next/dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

interface Photo {
  src: string
  alt: string
  type?: 'image' | 'video'
  poster?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedPhoto(index)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const goToPrevious = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1)
    }
  }

  const goToNext = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === photos.length - 1 ? 0 : selectedPhoto + 1)
    }
  }

  return (
    <section className="w-full py-16 px-6 bg-pastel-light">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent">
            Galería
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mt-4"></div>
        </div>

        {/* Grid de fotos y videos - Masonry layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
              onClick={() => openLightbox(index)}
            >
              {photo.type === 'video' ? (
                <div className="relative">
                  <video
                    src={photo.src}
                    className="w-full h-auto object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[20px] border-l-secondary border-y-[12px] border-y-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Botón cerrar */}
            <button
              className="absolute top-4 right-4 text-white text-3xl hover:opacity-70 transition-opacity z-10"
              onClick={closeLightbox}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>

            {/* Botón anterior */}
            <button
              className="absolute left-4 text-white text-4xl hover:opacity-70 transition-opacity z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              aria-label="Foto anterior"
            >
              <FaChevronLeft />
            </button>

            {/* Imagen o Video */}
            {photos[selectedPhoto].type === 'video' ? (
              <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
                <ReactPlayer
                  url={photos[selectedPhoto].src}
                  controls
                  playing={false}
                  width="100%"
                  height="100%"
                  light={photos[selectedPhoto].poster || true}
                />
              </div>
            ) : (
              <img
                src={photos[selectedPhoto].src}
                alt={photos[selectedPhoto].alt}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Botón siguiente */}
            <button
              className="absolute right-4 text-white text-4xl hover:opacity-70 transition-opacity z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              aria-label="Foto siguiente"
            >
              <FaChevronRight />
            </button>

            {/* Contador */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
              {selectedPhoto + 1} / {photos.length}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}