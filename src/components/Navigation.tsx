import Link from 'next/link'
import type { ReactNode } from 'react'

interface NavigationProps {
  className?: string
  showCTA?: boolean
  isMobile?: boolean
  authItem?: {
    href?: string
    onClick?: () => void
    label: string
    icon: ReactNode
  } | null
}

export default function Navigation({ className = '', showCTA = true, isMobile = false, authItem = null }: NavigationProps) {
  const navItems = [
    {
      href: "/",
      label: "Inicio",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: "/sobre-mi",
      label: "Sobre Mi",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8h.01" />
          <circle cx="12" cy="12" r="9" strokeWidth={2} />
        </svg>
      )
    },
    {
      href: "/blog",
      label: "Blog",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      href: "/contactame",
      label: "Contáctame",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  if (isMobile) {
    return (
      <div className={`flex justify-around items-center py-1 px-2 ${className}`}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center py-1 px-1 min-w-0">
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
        {authItem && (
          authItem.onClick ? (
            <button
              onClick={authItem.onClick}
              className="flex flex-col items-center py-1 px-1 min-w-0"
            >
              {authItem.icon}
              <span className="text-xs font-medium">{authItem.label}</span>
            </button>
          ) : (
            <Link
              href={authItem.href!}
              className="flex flex-col items-center py-1 px-1 min-w-0"
            >
              {authItem.icon}
              <span className="text-xs font-medium">{authItem.label}</span>
            </Link>
          )
        )}
        {showCTA && (
          <Link
            href="/agendar-cita"
            className="flex flex-col items-center text-white px-2 py-1 rounded"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Cita</span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <nav className={`flex gap-6 ${className}`}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="hover:text-secondary transition-colors font-medium text-lg"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
