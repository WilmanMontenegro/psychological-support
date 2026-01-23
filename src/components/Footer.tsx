import Link from 'next/link'
import Navigation from './Navigation'
import Logo from './Logo'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="w-full px-6 pt-8 pb-20 lg:py-8 text-white bg-accent">
      <div className="max-w-6xl mx-auto">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

          {/* Logo y descripción */}
          <div className="flex flex-col items-center lg:items-start">
            <Logo
              size="large"
              textColor="text-white"
              textAlign="center"
            />
          </div>

          {/* Navegación */}
          <div className="flex flex-col items-center justify-center">
            <Navigation className="flex-wrap justify-center gap-6" showCTA={false} />
          </div>

          {/* Redes sociales */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/anamarcelapobastidas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl transition-transform hover:scale-110 p-2"
                aria-label="Facebook"
              >
                <FaFacebook className="text-white" />
              </Link>
              <Link
                href="https://www.instagram.com/ana_marcela.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl transition-transform hover:scale-110 p-2"
                aria-label="Instagram"
              >
                <FaInstagram className="text-white" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/marcela-polo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl transition-transform hover:scale-110 p-2"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-white/20 mt-5 pt-5 text-center">
          <p className="text-sm text-white/80 font-montserrat">
            © {new Date().getFullYear()} Acompañamiento Psicológico. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}