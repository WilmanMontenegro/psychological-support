import Link from 'next/link'
import type { ReactNode } from 'react'

interface NavigationProps {
  className?: string
  variant?: 'default' | 'footer'
  showCTA?: boolean
  isMobile?: boolean
  authItem?: {
    href?: string
    onClick?: () => void
    label: string
    icon: ReactNode
  } | null
}

export default function Navigation({ className = '', variant = 'default', showCTA = true, isMobile = false, authItem = null }: NavigationProps) {
  const isFooter = variant === 'footer'
  const linkClassName = isFooter
    ? 'hover:text-secondary transition-colors font-medium text-sm md:text-base whitespace-nowrap shrink-0'
    : 'hover:text-secondary transition-colors font-medium text-base xl:text-lg whitespace-nowrap shrink-0'
  const navClassName = isFooter
    ? `flex flex-wrap justify-center gap-x-3 gap-y-2 sm:gap-x-4 md:gap-x-5 ${className}`
    : `flex flex-nowrap gap-4 xl:gap-6 ${className}`
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
      href: "/eventos",
      label: "Eventos",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
    // notranslate: Google Translate alarga etiquetas y estira el tab bar.
    const itemClassName =
      'flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1 text-center'
    const labelClassName =
      'max-w-full truncate text-[10px] font-medium leading-tight tracking-tight'

    return (
      <nav
        className={`notranslate flex w-full items-stretch justify-between gap-0 px-1 py-1 ${className}`}
        translate="no"
        aria-label="Navegación principal"
      >
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={itemClassName}>
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
              {item.icon}
            </span>
            <span className={labelClassName}>{item.label}</span>
          </Link>
        ))}
        {authItem && (
          authItem.onClick ? (
            <button
              type="button"
              onClick={authItem.onClick}
              className={itemClassName}
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
                {authItem.icon}
              </span>
              <span className={labelClassName}>{authItem.label}</span>
            </button>
          ) : (
            <Link href={authItem.href!} className={itemClassName}>
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
                {authItem.icon}
              </span>
              <span className={labelClassName}>{authItem.label}</span>
            </Link>
          )
        )}
        {showCTA && (
          <Link
            href="/contactame"
            className={`${itemClassName} rounded text-white`}
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <span className={labelClassName}>Contacto</span>
          </Link>
        )}
      </nav>
    )
  }

  return (
    <nav className={navClassName}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={linkClassName}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
