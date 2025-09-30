"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types/database"

interface NewOrderFormProps {
  user: User
}

export function NewOrderForm({ user }: NewOrderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [orderData, setOrderData] = useState<{
    orderType: string
    amountSend: number
    amountReceive: number
    exchangeRate: number
  } | null>(null)

  const [formData, setFormData] = useState({
    senderName: "",
    senderBank: "",
    senderAccount: "",
    receiverName: "",
    receiverBank: "",
    receiverAccount: "",
    receiverDocument: "",
    clientNotes: "",
  })

  useEffect(() => {
    // Get order data from sessionStorage
    const data = sessionStorage.getItem("orderData")
    if (data) {
      setOrderData(JSON.parse(data))
    } else {
      router.push("/dashboard/calculator")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!orderData) {
      setError("Datos de orden no encontrados")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderData,
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear la orden")
      }

      const { orderId } = await response.json()

      // Clear sessionStorage
      sessionStorage.removeItem("orderData")

      // Redirect to order details
      router.push(`/dashboard/orders/${orderId}`)
    } catch (err) {
      console.error("[v0] Error creating order:", err)
      setError("Error al crear la orden. Por favor intenta de nuevo.")
      setLoading(false)
    }
  }

  if (!orderData) {
    return null
  }

  const fromCurrency = orderData.orderType === "soles_to_bolivares" ? "PEN" : "VES"
  const toCurrency = orderData.orderType === "soles_to_bolivares" ? "VES" : "PEN"

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/calculator"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la calculadora
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Nueva Orden de Cambio</h1>
        <p className="text-muted-foreground">Completa los datos bancarios para procesar tu intercambio</p>
      </div>

      {/* Order Summary */}
      <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-4">Resumen de la Orden</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Envías</div>
            <div className="text-2xl font-bold text-foreground">
              {orderData.amountSend.toFixed(2)} {fromCurrency}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Recibes</div>
            <div className="text-2xl font-bold text-foreground">
              {orderData.amountReceive.toFixed(2)} {toCurrency}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          Tasa de cambio: 1 {fromCurrency} = {orderData.exchangeRate.toFixed(4)} {toCurrency}
        </div>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Sender Information */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Datos del Remitente (Quien Envía)</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senderName" className="text-foreground">
                Nombre Completo
              </Label>
              <Input
                id="senderName"
                type="text"
                placeholder="Juan Pérez"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderBank" className="text-foreground">
                Banco
              </Label>
              <Input
                id="senderBank"
                type="text"
                placeholder="Banco de Crédito del Perú"
                value={formData.senderBank}
                onChange={(e) => setFormData({ ...formData, senderBank: e.target.value })}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderAccount" className="text-foreground">
                Número de Cuenta
              </Label>
              <Input
                id="senderAccount"
                type="text"
                placeholder="1234567890"
                value={formData.senderAccount}
                onChange={(e) => setFormData({ ...formData, senderAccount: e.target.value })}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        {/* Receiver Information */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Datos del Beneficiario (Quien Recibe)</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receiverName" className="text-foreground">
                Nombre Completo
              </Label>
              <Input
                id="receiverName"
                type="text"
                placeholder="María González"
                value={formData.receiverName}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverDocument" className="text-foreground">
                Documento de Identidad
              </Label>
              <Input
                id="receiverDocument"
                type="text"
                placeholder="V-12345678"
                value={formData.receiverDocument}
                onChange={(e) => setFormData({ ...formData, receiverDocument: e.target.value })}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverBank" className="text-foreground">
                Banco
              </Label>
              <Input
                id="receiverBank"
                type="text"
                placeholder="Banco de Venezuela"
                value={formData.receiverBank}
                onChange={(e) => setFormData({ ...formData, receiverBank: e.target.value })}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiverAccount" className="text-foreground">
                Número de Cuenta
              </Label>
              <Input
                id="receiverAccount"
                type="text"
                placeholder="0123456789012345678901"
                value={formData.receiverAccount}
                onChange={(e) => setFormData({ ...formData, receiverAccount: e.target.value })}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        {/* Additional Notes */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Notas Adicionales (Opcional)</h3>
          <Textarea
            placeholder="Agrega cualquier información adicional que consideres importante..."
            value={formData.clientNotes}
            onChange={(e) => setFormData({ ...formData, clientNotes: e.target.value })}
            disabled={loading}
            className="bg-background min-h-24"
          />
        </Card>

        <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-accent text-accent-foreground">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creando orden...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Crear Orden
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
