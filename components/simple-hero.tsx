"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SimpleHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background without overlay */}
      <div className="absolute inset-0 -z-10">
      </div>

      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">📈 Tasas competitivas en tiempo real</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Cambia tu dinero entre{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Perú y Venezuela
            </span>{" "}
            de forma segura
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Intercambia Soles y Bolívares con las mejores tasas del mercado. Rápido, seguro y confiable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                Comenzar Ahora →
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Ver Cómo Funciona
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl">🛡️</div>
              <div className="text-left">
                <div className="font-semibold text-foreground">100% Seguro</div>
                <div className="text-sm text-muted-foreground">Verificación KYC</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl">⚡</div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Rápido</div>
                <div className="text-sm text-muted-foreground">Proceso en minutos</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl">📊</div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Mejores Tasas</div>
                <div className="text-sm text-muted-foreground">Actualizadas diariamente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
