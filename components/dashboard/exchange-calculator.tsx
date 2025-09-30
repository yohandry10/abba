"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeftRight, TrendingUp, RefreshCw } from "lucide-react"
import { useRealtimeRates } from "@/lib/hooks/use-realtime-rates"
import type { User } from "@/lib/types/database"
import { useRouter } from "next/navigation"

interface ExchangeCalculatorProps {
  user: User
}

interface ExchangeRate {
  soles_to_bolivares: number
  bolivares_to_soles: number
  published_at: string
}

export function ExchangeCalculator({ user }: ExchangeCalculatorProps) {
  const router = useRouter()
  const { currentRate: rates, loading, error, refreshRates } = useRealtimeRates()
  const [orderType, setOrderType] = useState<"soles_to_bolivares" | "bolivares_to_soles">("soles_to_bolivares")
  const [amountSend, setAmountSend] = useState("")
  const [amountReceive, setAmountReceive] = useState("")

  useEffect(() => {
    if (!rates || !amountSend) {
      setAmountReceive("")
      return
    }

    const amount = Number.parseFloat(amountSend)
    if (isNaN(amount)) {
      setAmountReceive("")
      return
    }

    const rate = orderType === "soles_to_bolivares" ? rates.soles_to_bolivares : rates.bolivares_to_soles
    const result = amount * rate
    setAmountReceive(result.toFixed(2))
  }, [amountSend, orderType, rates])

  const handleSwapCurrencies = () => {
    setOrderType(orderType === "soles_to_bolivares" ? "bolivares_to_soles" : "soles_to_bolivares")
    setAmountSend(amountReceive)
    setAmountReceive(amountSend)
  }

  const handleCreateOrder = () => {
    if (!amountSend || !amountReceive) return

    // Store calculation data in sessionStorage
    sessionStorage.setItem(
      "orderData",
      JSON.stringify({
        orderType,
        amountSend: Number.parseFloat(amountSend),
        amountReceive: Number.parseFloat(amountReceive),
        exchangeRate: orderType === "soles_to_bolivares" ? rates?.soles_to_bolivares : rates?.bolivares_to_soles,
      }),
    )

    router.push("/dashboard/orders/new")
  }

  const fromCurrency = orderType === "soles_to_bolivares" ? "PEN" : "VES"
  const toCurrency = orderType === "soles_to_bolivares" ? "VES" : "PEN"
  const fromLabel = orderType === "soles_to_bolivares" ? "Soles (PEN)" : "Bolívares (VES)"
  const toLabel = orderType === "soles_to_bolivares" ? "Bolívares (VES)" : "Soles (PEN)"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora de Cambio</h1>
            <p className="text-muted-foreground">
              Calcula cuánto recibirás con las tasas actuales • Actualizaciones en tiempo real
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRates}
            disabled={loading}
            className="h-8"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Current Rate Display */}
      {rates && (
        <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Tasa Actual</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            1 {fromCurrency} ={" "}
            {orderType === "soles_to_bolivares"
              ? rates.soles_to_bolivares.toFixed(4)
              : rates.bolivares_to_soles.toFixed(4)}{" "}
            {toCurrency}
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-muted-foreground">
              Actualizado:{" "}
              {new Date(rates.published_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              En vivo
            </div>
          </div>
        </Card>
      )}

      {/* Calculator */}
      <Card className="p-8">
        <div className="space-y-6">
          {/* Amount to Send */}
          <div className="space-y-2">
            <Label htmlFor="amountSend" className="text-foreground">
              Envías
            </Label>
            <div className="relative">
              <Input
                id="amountSend"
                type="number"
                placeholder="0.00"
                value={amountSend}
                onChange={(e) => setAmountSend(e.target.value)}
                className="text-2xl h-14 pr-20 bg-background"
                step="0.01"
                min="0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {fromCurrency}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">{fromLabel}</div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapCurrencies}
              className="rounded-full w-12 h-12 bg-background"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Amount to Receive */}
          <div className="space-y-2">
            <Label htmlFor="amountReceive" className="text-foreground">
              Recibes
            </Label>
            <div className="relative">
              <Input
                id="amountReceive"
                type="text"
                placeholder="0.00"
                value={amountReceive}
                readOnly
                className="text-2xl h-14 pr-20 bg-muted"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {toCurrency}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">{toLabel}</div>
          </div>

          {/* Create Order Button */}
          <Button
            onClick={handleCreateOrder}
            disabled={!amountSend || !amountReceive || loading || user.status !== "active"}
            className="w-full h-12 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Crear Orden
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {user.status !== "active" && (
            <p className="text-sm text-center text-muted-foreground">
              Debes completar la verificación KYC para crear órdenes
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
