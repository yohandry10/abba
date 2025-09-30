"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function SimpleNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Llama Travel" width={120} height={40} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#rates" className="text-foreground/80 hover:text-foreground transition-colors">
              Tasas
            </Link>
            <Link href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              Cómo Funciona
            </Link>
            <Link href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
              Nosotros
            </Link>
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Registrarse</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="flex flex-col gap-4">
              <Link
                href="#rates"
                className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tasas
              </Link>
              <Link
                href="#how-it-works"
                className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link
                href="#about"
                className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Registrarse</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
