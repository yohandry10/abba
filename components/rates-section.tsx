"use client"

import { Card } from "@/components/ui/card"
import { useRealtimeRates } from "@/lib/hooks/use-realtime-rates"
import { formatExchangeRate } from "@/lib/utils"
import { TrendingUp, Wifi, WifiOff } from "lucide-react"
import { useState, useEffect } from "react"

export function RatesSection() {
  const { rates, currentRate, loading, error } = useRealtimeRates()
  const [isOnline, setIsOnline] = useState(true)

  // Si no hay currentRate, usar la primera tasa activa de la lista
  const activeRate = currentRate || rates.find((rate: any) => rate.is_active) || rates[0]

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <section id="tasas" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full mb-6 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-heading font-semibold text-primary">Tasas de Hoy</span>
            <div className="flex items-center gap-1 ml-2">
              {isOnline ? (
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-green-600" />
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <WifiOff className="w-3 h-3 text-red-600" />
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
              )}
            </div>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 text-balance">
            Tasas de Cambio <span className="text-primary">Actuales</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg xl:text-xl max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed">
            En <span className="font-semibold text-foreground">Abba Cambios</span> actualizamos nuestras tasas
            diariamente para ofrecerte el mejor valor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-xs sm:max-w-2xl lg:max-w-5xl mx-auto">
          <Card className="p-4 sm:p-6 lg:p-8 xl:p-10 hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-card/80 backdrop-blur-sm hover:scale-105 animate-fade-in-up group">
            <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
              <div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">De Perú a Venezuela</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground">PEN → VES</div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            <div className="mb-4 sm:mb-6">
              <div className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Tasa de cambio</div>
              {loading ? (
                <div className="h-12 sm:h-14 lg:h-16 bg-muted/50 animate-pulse rounded-lg skeleton" />
              ) : activeRate ? (
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-extrabold text-primary animate-fade-in">
                  {formatExchangeRate(activeRate.soles_to_bolivares)}{" "}
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">Bs</span>
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-extrabold text-muted-foreground animate-fade-in">
                  -.----{" "}
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">Bs</span>
                </div>
              )}
            </div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">Por cada Sol peruano</div>
          </Card>

          <Card
            className="p-8 md:p-10 hover:shadow-2xl transition-all duration-500 border-2 hover:border-accent/50 bg-card/80 backdrop-blur-sm hover:scale-105 animate-fade-in-up group"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">De Venezuela a Perú</div>
                <div className="text-3xl font-heading font-bold text-foreground">VES → PEN</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-3">Tasa de cambio</div>
              {loading ? (
                <div className="h-16 bg-muted/50 animate-pulse rounded-lg skeleton" />
              ) : activeRate ? (
                <div className="text-5xl md:text-6xl font-heading font-extrabold text-accent animate-fade-in">
                  {formatExchangeRate(activeRate.bolivares_to_soles)}{" "}
                  <span className="text-3xl text-muted-foreground font-medium">S/</span>
                </div>
              ) : (
                <div className="text-5xl md:text-6xl font-heading font-extrabold text-muted-foreground animate-fade-in">
                  -.----{" "}
                  <span className="text-3xl text-muted-foreground font-medium">S/</span>
                </div>
              )}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Por cada Bolívar venezolano</div>
          </Card>
        </div>

        {activeRate && (
          <div
            className="text-center mt-10 text-sm font-medium text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>
                Última actualización:{" "}
                {new Date(activeRate.published_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-center mt-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>
    </section>
  )
}
