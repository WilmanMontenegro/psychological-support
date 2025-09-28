"use client"
import Link from 'next/link'
import { useState } from 'react'
import Navigation from './Navigation'
import Logo from './Logo'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full relative bg-background shadow-sm">
      <div className="flex lg:grid lg:grid-cols-3 items-center justify-center lg:justify-normal px-4 md:px-6 py-4">
        {/* Logo/Título */}
        <Logo textAlign="center" />

        {/* Navegación Desktop - Centrada */}
        <div className="hidden lg:flex justify-center">
          <Navigation className="" showCTA={false} />
        </div>

        {/* Botón CTA */}
        <div className="flex justify-end">
          <Link
            href="/agendar"
            className="hidden sm:block text-white px-2 sm:px-3 lg:px-4 py-2 rounded hover:opacity-80 transition-colors font-montserrat font-medium text-xs sm:text-sm lg:text-base"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <span className="lg:inline">Agendar </span>Cita
          </Link>
        </div>
      </div>

      {/* Navegación móvil fija abajo */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 pb-safe">
        <Navigation className="" showCTA={true} isMobile={true} />
      </div>
    </header>
  )
}