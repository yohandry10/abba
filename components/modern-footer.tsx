import Link from "next/link"
import Image from "next/image"

export function ModernFooter() {
  return (
    <footer
      id="contacto"
      className="relative overflow-hidden"
      style={{ backgroundColor: '#1f2322' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 flex flex-col items-center md:items-start">
            <div className="mb-8">
              <div className="relative w-96 h-40 md:w-[450px] md:h-48 lg:w-[550px] lg:h-56">
                <Image src="/logo.png" alt="Abba Cambios" fill className="object-contain" />
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md text-center md:text-left">
              Tu casa de cambio de confianza para intercambios entre Perú y Venezuela. Ofrecemos las mejores tasas del
              mercado con seguridad y rapidez.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="#"
                className="w-12 h-12 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <svg
                  className="w-6 h-6 text-primary group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-lg text-white mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#tasas"
                  className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center justify-center md:justify-start gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Tasas de Cambio
                </Link>
              </li>
              <li>
                <Link
                  href="#nosotros"
                  className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center justify-center md:justify-start gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  ¿Por qué elegirnos?
                </Link>
              </li>
              <li>
                <Link
                  href="#mision"
                  className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center justify-center md:justify-start gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Misión y Visión
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-lg text-white mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start gap-3 text-gray-300 group">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="group-hover:text-white transition-colors">info@abbacambios.com</span>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-3 text-gray-300 group">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="group-hover:text-white transition-colors">+51 999 999 999</span>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-3 text-gray-300 group">
                <svg
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="group-hover:text-white transition-colors">Lima, Perú</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-300 text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Abba Cambios</span>. Todos
            los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-primary transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}