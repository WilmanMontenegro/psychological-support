"use client"
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from './Navigation'
import Logo from './Logo'
import BottomSheet from './BottomSheet'
import { supabase } from '@/lib/supabase'
import { FaSignInAlt } from 'react-icons/fa'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const router = useRouter()

  const getUserRole = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()


    setUserRole(data?.role || 'patient')
  }, [])

  const checkUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      await getUserRole(user.id)
    } else {
      setUserRole(null)
    }
  }, [getUserRole])

  useEffect(() => {
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getUserRole(session.user.id)
      } else {
        setUserRole(null)
      }
    })

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showDropdown && !target.closest('.user-dropdown')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [checkUser, getUserRole, showDropdown])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setShowDropdown(false)
    router.push('/')
  }

  const mobileAuthItem = user
    ? {
      onClick: () => setShowMobileMenu(true),
      label: 'Menú',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
    : {
      href: '/login',
      label: 'Ingresar',
      icon: <FaSignInAlt size={18} />
    }

  return (
    <header className="w-full relative bg-background shadow-sm border-b border-secondary/10">
      <div className="flex lg:grid lg:grid-cols-3 items-center justify-center sm:justify-between lg:justify-normal px-4 md:px-6 py-3 md:py-4">
        {/* Logo/Título */}
        <Logo textAlign="center" />

        {/* Navegación Desktop - Centrada */}
        <div className="hidden lg:flex justify-center">
          <Navigation className="" showCTA={false} />
        </div>

        {/* Botón CTA y Usuario */}
        <div className="flex items-center justify-end gap-3">
          {/* Solo mostrar "Agendar Cita" a pacientes o usuarios no logueados */}
          {(!user || userRole === 'patient') && (
            <Link
              href="/agendar-cita"
              className="hidden sm:block text-white px-2 sm:px-3 lg:px-4 py-2 rounded hover:brightness-95 transition-all font-montserrat font-medium text-xs sm:text-sm lg:text-base shadow-md"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              <span className="lg:inline">Agendar </span>Cita
            </Link>
          )}

          {/* Icono de Usuario */}
          {user ? (
            <div className="relative hidden sm:flex user-dropdown">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:opacity-80 transition-opacity"
                style={{ backgroundColor: 'var(--color-secondary)' }}
                aria-label="Menú de usuario"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user_metadata?.full_name || 'Usuario'}
                    </p>
                    {userRole && userRole !== 'patient' && (
                      <p className="text-xs text-gray-500 capitalize">{userRole === 'psychologist' ? 'Psicólogo' : 'Administrador'}</p>
                    )}
                  </div>
                  <Link
                    href="/mi-perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Mi Perfil
                  </Link>

                  {/* Opciones para pacientes */}
                  {userRole === 'patient' && (
                    <>
                      <Link
                        href="/mis-citas"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Mis Citas
                      </Link>
                      <Link
                        href="/agendar-cita"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Agendar Cita
                      </Link>
                    </>
                  )}

                  {/* Opciones para psicólogos */}
                  {userRole === 'psychologist' && (
                    <>
                      <Link
                        href="/mis-citas"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Citas Asignadas
                      </Link>
                      <Link
                        href="/mi-disponibilidad"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Mi Disponibilidad
                      </Link>
                    </>
                  )}

                  {/* Opciones para admins */}
                  {userRole === 'admin' && (
                    <>
                      <Link
                        href="/mis-citas"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Todas las Citas
                      </Link>
                      <Link
                        href="/mi-disponibilidad"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Disponibilidad
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-montserrat font-medium border shadow-sm hover:shadow-md transition-all"
              style={{
                backgroundColor: '#fff',
                color: 'var(--color-secondary)',
                borderColor: 'var(--color-secondary)'
              }}
              aria-label="Iniciar sesión"
            >
              <FaSignInAlt size={18} className="text-current" />
              <span className="text-current">Ingresar</span>
            </Link>
          )}
        </div>
      </div>

      {/* Navegación móvil fija abajo */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 pb-safe">
        <Navigation className="" showCTA={true} isMobile={true} authItem={mobileAuthItem} />
      </div>

      {/* Menú móvil */}
      <BottomSheet
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        title={user?.user_metadata?.full_name || 'Mi Cuenta'}
      >
        <div className="space-y-1">
          {/* Mi Perfil */}
          <Link
            href="/mi-perfil"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pastel-light/50 transition-colors"
          >
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Mi Perfil</span>
          </Link>

          {/* Opciones para pacientes */}
          {userRole === 'patient' && (
            <>
              <Link
                href="/mis-citas"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pastel-light/50 transition-colors"
              >
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Mis Citas</span>
              </Link>
              <Link
                href="/agendar-cita"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pastel-light/50 transition-colors"
              >
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Agendar Cita</span>
              </Link>
            </>
          )}

          {/* Opciones para psicólogos */}
          {userRole === 'psychologist' && (
            <>
              <Link
                href="/mis-citas"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pastel-light/50 transition-colors"
              >
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Citas Asignadas</span>
              </Link>
              <Link
                href="/mi-disponibilidad"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pastel-light/50 transition-colors"
              >
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Mi Disponibilidad</span>
              </Link>
            </>
          )}

          {/* Opciones para admins */}
          {userRole === 'admin' && (
            <>
              <Link
                href="/mis-citas"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pastel-light/50 transition-colors"
              >
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Todas las Citas</span>
              </Link>
              <Link
                href="/mi-disponibilidad"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-pastel-light/50 transition-colors"
              >
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Disponibilidad</span>
              </Link>
            </>
          )}

          {/* Separador */}
          <div className="border-t border-gray-100 my-2" />

          {/* Cerrar sesión */}
          <button
            onClick={() => { handleLogout(); setShowMobileMenu(false) }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </BottomSheet>
    </header>
  )
}
