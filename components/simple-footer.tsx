import Link from "next/link"

export function SimpleFooter() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">CC</span>
              </div>
              <span className="font-bold text-xl text-foreground">CasaDeCambio</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tu casa de cambio confiable para intercambios entre Perú y Venezuela
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#rates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tasas
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📧</span>
                <span>info@casadecambio.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📱</span>
                <span>+51 999 999 999</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📍</span>
                <span>Lima, Perú</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CasaDeCambio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
