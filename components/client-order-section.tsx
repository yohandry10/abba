"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, CheckCircle2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function ClientOrderSection() {
  const [user, setUser] = useState<User | null>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_bank: "",
    sender_account: "",
    receiver_name: "",
    receiver_bank: "",
    receiver_account: "",
    receiver_document: "",
    client_notes: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user)
      })
    }

    // Check for order data from calculator
    const savedOrderData = localStorage.getItem("orderData")
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !orderData) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderData,
          ...formData
        })
      })

      if (response.ok) {
        setSuccess(true)
        localStorage.removeItem("orderData")
        setOrderData(null)
        setFormData({
          sender_name: "",
          sender_bank: "",
          sender_account: "",
          receiver_name: "",
          receiver_bank: "",
          receiver_account: "",
          receiver_document: "",
          client_notes: ""
        })
      }
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  if (success) {
    return (
      <section id="crear-orden" className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">¡Orden Creada Exitosamente!</h3>
            <p className="text-muted-foreground mb-6">
              Tu orden ha sido enviada y está siendo procesada. Te notificaremos cuando esté lista.
            </p>
            <Button onClick={() => setSuccess(false)} variant="outline">
              Crear Nueva Orden
            </Button>
          </Card>
        </div>
      </section>
    )
  }

  if (!orderData) return null

  return (
    <section id="crear-orden" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Crear Orden de Cambio</h2>
          <p className="text-muted-foreground">
            Completa los datos para procesar tu cambio de {orderData.amount_from} {orderData.currency_from} por {orderData.amount_to.toFixed(8)} {orderData.currency_to}
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Datos del Remitente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Datos del Remitente</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="sender_name">Nombre Completo</Label>
                  <Input
                    id="sender_name"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({...formData, sender_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_bank">Banco</Label>
                  <Input
                    id="sender_bank"
                    value={formData.sender_bank}
                    onChange={(e) => setFormData({...formData, sender_bank: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_account">Número de Cuenta</Label>
                  <Input
                    id="sender_account"
                    value={formData.sender_account}
                    onChange={(e) => setFormData({...formData, sender_account: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Datos del Beneficiario */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Datos del Beneficiario</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="receiver_name">Nombre Completo</Label>
                  <Input
                    id="receiver_name"
                    value={formData.receiver_name}
                    onChange={(e) => setFormData({...formData, receiver_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver_bank">Banco</Label>
                  <Input
                    id="receiver_bank"
                    value={formData.receiver_bank}
                    onChange={(e) => setFormData({...formData, receiver_bank: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver_account">Número de Cuenta</Label>
                  <Input
                    id="receiver_account"
                    value={formData.receiver_account}
                    onChange={(e) => setFormData({...formData, receiver_account: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiver_document">Documento de Identidad</Label>
                  <Input
                    id="receiver_document"
                    value={formData.receiver_document}
                    onChange={(e) => setFormData({...formData, receiver_document: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="client_notes">Notas Adicionales (Opcional)</Label>
              <Textarea
                id="client_notes"
                value={formData.client_notes}
                onChange={(e) => setFormData({...formData, client_notes: e.target.value})}
                placeholder="Cualquier información adicional..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-primary text-primary-foreground"
            >
              {submitting ? (
                "Creando Orden..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Crear Orden de Cambio
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}