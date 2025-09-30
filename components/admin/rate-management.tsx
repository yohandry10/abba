"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Plus, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { useRealtimeRates } from "@/lib/hooks/use-realtime-rates"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { formatExchangeRate } from "@/lib/utils"

interface RateManagementProps {
  userId: string
}

interface ExchangeRate {
  id: string
  soles_to_bolivares: number
  bolivares_to_soles: number
  published_at: string
  is_active: boolean
}

export function RateManagement({ userId }: RateManagementProps) {
  const { rates, loading, error: ratesError, refreshRates } = useRealtimeRates()
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState("")
  const [newRates, setNewRates] = useState({
    soles_to_bolivares: "",
    bolivares_to_soles: "",
  })
  const [isOnline, setIsOnline] = useState(true)
  const supabase = getSupabaseBrowserClient()

  // Monitor connection status
  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel('rates-connection-status')
    
    channel.on('system', {}, (payload) => {
      if (payload.event === 'connected') {
        setIsOnline(true)
      } else if (payload.event === 'disconnected') {
        setIsOnline(false)
      }
    })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handlePublishRate = async () => {
    setError("")
    setPublishing(true)

    const solesToBolivares = Number.parseFloat(newRates.soles_to_bolivares)
    const bolivaresToSoles = Number.parseFloat(newRates.bolivares_to_soles)

    if (isNaN(solesToBolivares) || isNaN(bolivaresToSoles)) {
      setError("Por favor ingresa valores numéricos válidos")
      setPublishing(false)
      return
    }

    if (solesToBolivares <= 0 || bolivaresToSoles <= 0) {
      setError("Las tasas deben ser mayores a 0")
      setPublishing(false)
      return
    }

    try {
      const response = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soles_to_bolivares: solesToBolivares,
          bolivares_to_soles: bolivaresToSoles,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al publicar tasas")
      }

      setNewRates({ soles_to_bolivares: "", bolivares_to_soles: "" })
      refreshRates()
    } catch (err) {
      console.error("[v0] Error publishing rates:", err)
      setError("Error al publicar las tasas. Por favor intenta de nuevo.")
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">Gestión de Tasas de Cambio</h1>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <Wifi className="w-3 h-3" />
                    En línea
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    <WifiOff className="w-3 h-3" />
                    Sin conexión
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshRates}
                  disabled={loading}
                  className="h-7"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Publica y gestiona las tasas de cambio diarias • Actualizaciones en tiempo real
            </p>
            {(error || ratesError) && (
              <p className="text-sm text-red-600 mt-1">{error || ratesError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Publish New Rate */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Publicar Nueva Tasa</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="solesToBolivares" className="text-foreground">
              Soles a Bolívares (PEN → VES)
            </Label>
            <Input
              id="solesToBolivares"
              type="number"
              placeholder="13.5000"
              value={newRates.soles_to_bolivares}
              onChange={(e) => setNewRates({ ...newRates, soles_to_bolivares: e.target.value })}
              step="0.0001"
              disabled={publishing}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Cuántos bolívares por cada sol</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bolivaresToSoles" className="text-foreground">
              Bolívares a Soles (VES → PEN)
            </Label>
            <Input
              id="bolivaresToSoles"
              type="number"
              placeholder="0.0741"
              value={newRates.bolivares_to_soles}
              onChange={(e) => setNewRates({ ...newRates, bolivares_to_soles: e.target.value })}
              step="0.0001"
              disabled={publishing}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Cuántos soles por cada bolívar</p>
          </div>
        </div>

        <Button
          onClick={handlePublishRate}
          disabled={publishing || !newRates.soles_to_bolivares || !newRates.bolivares_to_soles}
          className="w-full bg-primary text-primary-foreground"
        >
          {publishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Publicar Tasas
            </>
          )}
        </Button>
      </Card>

      {/* Rate History */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">Historial de Tasas</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-16 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {rates.map((rate) => (
            <Card key={rate.id} className={`p-6 ${rate.is_active ? "border-2 border-primary" : ""}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  {rate.is_active && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">ACTIVA</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">PEN → VES</div>
                      <div className="text-lg font-bold text-foreground">{formatExchangeRate(rate.soles_to_bolivares)} Bs</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">VES → PEN</div>
                      <div className="text-lg font-bold text-foreground">{formatExchangeRate(rate.bolivares_to_soles)} S/</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Publicado:{" "}
                    {new Date(rate.published_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
