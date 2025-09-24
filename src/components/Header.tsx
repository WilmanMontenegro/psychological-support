"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full flex items-center justify-evenly px-6 py-4 bg-background">
      {/* Logo/Título */}
      <div className='flex items-center gap-4'>
        <img src="/images/logo.png" alt="Logo" width={100}/>
        <div>
          <h1 className="text-xl font-semibold font-libre-baskerville">Acompañamiento Psicológico</h1>
          <p className="text-base font-montserrat">Con Marcela Polo</p>
        </div>
      </div>

      {/* Navegación Desktop */}
      <nav className='hidden md:flex gap-6'>
        <Link href="/" className="hover:text-secondary transition-colors font-medium">Inicio</Link>
        <Link href="/acerca" className="hover:text-secondary transition-colors font-medium">Sobre Mi</Link>
        <Link href="/blog" className="hover:text-secondary transition-colors font-medium">Blog</Link>
        <Link href="/contacto" className="hover:text-secondary transition-colors font-medium">Contacto</Link>
      </nav>

      {/* Botón CTA */}
      <Link
        href="/agendar"
        className="text-white px-4 py-2 rounded hover:opacity-80 transition-colors font-montserrat font-medium"
        style={{ backgroundColor: 'var(--color-secondary)' }}
      >
        Agendar Cita
      </Link>

      {/* Botón hamburger móvil */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>

      {/* Menú móvil (se muestra/oculta) */}
      {isMenuOpen && (
        <div className="flex flex-col gap-4 px-6 pb-4 md:hidden absolute top-full left-0 w-full bg-white shadow">
          <Link href="/">Inicio</Link>
          <Link href="/acerca">Acerca de</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/agendar" className="text-white px-4 py-2 rounded hover:opacity-80 transition font-montserrat font-medium" style={{ backgroundColor: 'var(--color-secondary)' }}>
            Agendar Cita
          </Link>
        </div>
      )}
    </header>
  )
}