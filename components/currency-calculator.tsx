"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, ArrowRightLeft, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { formatExchangeRate } from "@/lib/utils"
import { ClientActionButtons } from "./client-action-buttons"
import { useRealtimeRates } from "@/lib/hooks/use-realtime-rates"

export function CurrencyCalculator() {
  const { rates: allRates, currentRate, loading } = useRealtimeRates()
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("PEN")
  const [result, setResult] = useState<number | null>(null)

  // Usar la misma lógica que el componente de tasas
  const activeRate = currentRate || allRates.find((rate: any) => rate.is_active) || allRates[0]
  
  // Debug: verificar que tenga los mismos datos que rates-section
  if (activeRate) {
    console.log('CALCULATOR - soles_to_bolivares:', activeRate.soles_to_bolivares)
    console.log('CALCULATOR - bolivares_to_soles:', activeRate.bolivares_to_soles)
  }

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

  useEffect(() => {
    if (amount) {
      calculateExchange()
    }
  }, [amount, fromCurrency, activeRate])

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 rounded-full mb-3 sm:mb-4 border border-primary/20">
            <Calculator className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-primary">Calculadora</span>
          </div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4">
            Calcula tu <span className="text-primary">Cambio</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto">
            Descubre cuánto recibirás con nuestras tasas actualizadas en tiempo real
          </p>
        </div>

        <Card className="max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 shadow-xl border-2">
          <div className="space-y-4 sm:space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-xs sm:text-sm font-medium">
                Cantidad a cambiar
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-base sm:text-lg h-10 sm:h-12"
              />
            </div>

            {/* Currency Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-full sm:flex-1 space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Desde</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="h-10 sm:h-12">
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
                className="mt-0 sm:mt-6 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
              >
                <ArrowRightLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>

              <div className="w-full sm:flex-1 space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Hacia</Label>
                <div className="h-10 sm:h-12 px-3 py-2 border rounded-md bg-muted flex items-center text-muted-foreground text-sm sm:text-base">
                  {fromCurrency === "PEN" ? "🇻🇪 Bolívares (VES)" : "🇵🇪 Soles (PEN)"}
                </div>
              </div>
            </div>

            {/* Result */}
            {result !== null && (
              <div className="p-4 sm:p-6 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2">Recibirás</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
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

            {/* Action Buttons - Dynamic based on user state */}
            <ClientActionButtons result={result} fromCurrency={fromCurrency} rates={activeRate} />

            {/* Current Rates Info */}
            {activeRate && !loading && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Tasas actuales</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">PEN → VES</div>
                    <div className="font-semibold">{formatExchangeRate(activeRate.soles_to_bolivares)} Bs</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">VES → PEN</div>
                    <div className="font-semibold">{formatExchangeRate(activeRate.bolivares_to_soles)} S/</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Actualizado: {new Date(activeRate.published_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}