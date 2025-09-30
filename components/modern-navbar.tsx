"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Menu, X } from "lucide-react"

export function ModernNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Detect active section
      const sections = ["inicio", "tasas", "nosotros", "mision", "contacto"]
      const current = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check if user is logged in
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user)
        if (user) {
          // Get user role
          supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
              setUserRole(data?.role || null)
            })
        }
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
        if (!session?.user) {
          setUserRole(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const navLinks = [
    { href: "#inicio", label: "Inicio", id: "inicio" },
    { href: "#tasas", label: "Tasas", id: "tasas" },
    { href: "#nosotros", label: "Nosotros", id: "nosotros" },
    { href: "#mision", label: "Misión", id: "mision" },
    { href: "#contacto", label: "Contacto", id: "contacto" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-dark shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-visible relative">
        <div className="flex items-center justify-between h-16 md:h-20 lg:h-24 overflow-visible">
          {/* Logo - Absolute positioning, hidden when scrolled */}
          <Link href="/" className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 group transition-opacity duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}>
            <Image
              src="/logo.png"
              alt="Abba Cambios"
              width={300}
              height={80}
              className="w-[200px] sm:w-[250px] md:w-[280px] lg:w-[300px] h-auto object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation - With left padding to avoid logo overlap when not scrolled */}
          <div className={`hidden md:flex items-center justify-center flex-1 gap-6 lg:gap-8 transition-all duration-300 ${scrolled ? "pl-0" : "pl-[160px] lg:pl-[180px] xl:pl-[200px]"
            }`}>
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative transition-colors duration-200 font-medium text-sm lg:text-base ${scrolled
                    ? "text-primary hover:text-accent"
                    : "text-white hover:text-white/80"
                  }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className={`absolute -bottom-1 left-0 right-0 h-0.5 animate-slide-in-right ${scrolled ? "bg-primary" : "bg-white"
                    }`} />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {userRole === "client" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full font-semibold transition-all duration-300 hover:bg-white/20 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={async () => {
                    const supabase = getSupabaseBrowserClient()
                    if (supabase) {
                      await supabase.auth.signOut()
                      window.location.href = "/"
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="group flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Moved to the right */}
          <div className="md:hidden flex items-center gap-3 ml-auto">
            {!user && (
              <Link
                href="/login"
                className="flex items-center justify-center w-10 h-10 bg-white text-green-600 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-105 ${scrolled ? "bg-primary text-white" : "bg-white text-primary"
                }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-gray-800 hover:text-primary font-medium py-2 px-4 rounded-lg transition-colors ${activeSection === link.id ? "bg-primary/10 text-primary" : ""
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <div className="border-t pt-4 space-y-2">
                  {userRole === "client" && (
                    <Link
                      href="#mis-ordenes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-800 hover:text-primary font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Mis Órdenes
                    </Link>
                  )}

                  <button
                    onClick={async () => {
                      const supabase = getSupabaseBrowserClient()
                      if (supabase) {
                        await supabase.auth.signOut()
                        window.location.href = "/"
                      }
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium py-2 px-4 rounded-lg transition-colors w-full text-left"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
