"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simular progreso de carga
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo con animación sorprendente */}
        <div className="relative mb-8 animate-preloader-bounce">
          {/* Anillos concéntricos animados */}
          <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
            <div className="absolute inset-2 border-2 border-accent/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-4 border border-primary/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* Resplandor de fondo */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-full blur-2xl animate-pulse" />
          
          {/* Logo principal */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 transform hover:scale-110 transition-transform duration-300">
            <Image 
              src="/logo.png" 
              alt="Abba Cambios" 
              fill 
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
          
          {/* Partículas flotantes */}
          <div className="absolute -top-4 -left-4 w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="absolute -top-2 -right-6 w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
          <div className="absolute -bottom-2 -left-6 w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.9s' }} />
        </div>

        {/* Texto de carga */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-2 animate-fade-in">
            Abba Cambios
          </h2>
          <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Cargando tu experiencia de cambio...
          </p>
        </div>

        {/* Barra de progreso mejorada */}
        <div className="w-64 md:w-80 bg-muted/30 rounded-full h-3 overflow-hidden shadow-inner border border-muted/50">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500 ease-out relative animate-gradient"
            style={{ width: `${progress}%`, backgroundSize: '200% 100%' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full" />
            <div className="absolute right-0 top-0 w-2 h-full bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Porcentaje */}
        <div className="mt-4 text-sm font-medium text-gray-600">
          {Math.round(progress)}%
        </div>

        {/* Indicadores de carga animados mejorados */}
        <div className="flex gap-3 mt-6">
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce shadow-lg" />
          <div className="w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }} />
          <div className="w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>

      {/* Efectos adicionales */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-4 h-4 bg-primary/40 rounded-full animate-ping" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-accent/40 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-primary/40 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 right-10 w-5 h-5 bg-accent/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  )
}