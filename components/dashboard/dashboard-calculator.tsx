"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, ArrowRightLeft, TrendingUp, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types/database"
import { formatExchangeRate } from "@/lib/utils"
import { useRealtimeRates } from "@/lib/hooks/use-realtime-rates"

interface DashboardCalculatorProps {
  user: User
}

export function DashboardCalculator({ user }: DashboardCalculatorProps) {
  const router = useRouter()
  const { rates: allRates, currentRate, loading } = useRealtimeRates()
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("PEN")
  const [result, setResult] = useState<number | null>(null)

  // Usar la misma lógica que el componente de tasas
  const activeRate = currentRate || allRates.find((rate: any) => rate.is_active) || allRates[0]

  const calculateExchange = () => {
    if (!activeRate || !amount || isNaN(Number(amount))) {
      setResult(null)
      return
    }

    const inputAmount = Number(amount)
    if (fromCurrency === "PEN") {
      // Usar exactamente la misma lógica que funciona en rates-section
      setResult(inputAmount * activeRate.soles_to_bolivares)
    } else {
      // Usar exactamente la misma lógica que funciona en rates-section
      setResult(inputAmount * activeRate.bolivares_to_soles)
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(fromCurrency === "PEN" ? "VES" : "PEN")
    setResult(null)
  }

  const createOrder = () => {
    if (!result || !amount || !activeRate) return
    
    // Save order data to sessionStorage
    const orderData = {
      orderType: fromCurrency === "PEN" ? "soles_to_bolivares" : "bolivares_to_soles",
      amountSend: Number(amount),
      amountReceive: result,
      exchangeRate: fromCurrency === "PEN" ? activeRate.soles_to_bolivares : activeRate.bolivares_to_soles
    }
    
    sessionStorage.setItem("orderData", JSON.stringify(orderData))
    
    // Redirect to create order
    router.push("/dashboard/orders/create")
  }

  useEffect(() => {
    if (amount) {
      calculateExchange()
    }
  }, [amount, fromCurrency, activeRate])

  return (
    <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Calculadora de Cambio</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Calcula cuánto recibirás y crea tu orden de cambio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Calculator */}
        <Card className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Calculadora</h2>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Cantidad a cambiar
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg h-12"
              />
            </div>

            {/* Currency Selection */}
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Desde</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEN">🇵🇪 Soles (PEN)</SelectItem>
                    <SelectItem value="VES">🇻🇪 Bolívares (VES)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="mt-6 h-12 w-12 rounded-full"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>

              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">Hacia</Label>
                <div className="h-12 px-3 py-2 border rounded-md bg-muted flex items-center text-muted-foreground">
                  {fromCurrency === "PEN" ? "🇻🇪 Bolívares (VES)" : "🇵🇪 Soles (PEN)"}
                </div>
              </div>
            </div>

            {/* Result */}
            {result !== null && (
              <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Recibirás</div>
                  <div className="text-3xl font-bold text-primary">
                    {formatExchangeRate(result)} {fromCurrency === "PEN" ? "Bs" : "S/"}
                  </div>
                  {activeRate && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Tasa: 1 {fromCurrency} = {" "}
                      {fromCurrency === "PEN" 
                        ? formatExchangeRate(activeRate.soles_to_bolivares) + " VES"
                        : formatExchangeRate(activeRate.bolivares_to_soles) + " PEN"
                      }
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Create Order Button */}
            {result !== null && (
              <Button 
                onClick={createOrder}
                className="w-full h-12 bg-primary text-primary-foreground"
              >
                <Send className="w-4 h-4 mr-2" />
                Crear Orden de Cambio
              </Button>
            )}
          </div>
        </Card>

        {/* Current Rates & Info */}
        <div className="space-y-6">
          {/* Current Rates */}
          {activeRate && !loading && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Tasas Actuales</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">PEN → VES</span>
                  <span className="font-bold">{formatExchangeRate(activeRate.soles_to_bolivares)} Bs</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">VES → PEN</span>
                  <span className="font-bold">{formatExchangeRate(activeRate.bolivares_to_soles)} S/</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Actualizado: {new Date(activeRate.published_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* User Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tu Cuenta</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Usuario:</span>
                <span className="text-sm font-medium">{user.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estado:</span>
                <span className="text-sm font-medium text-green-600">Verificado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/orders")}
              >
                Ver Mis Órdenes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard")}
              >
                Ir al Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}