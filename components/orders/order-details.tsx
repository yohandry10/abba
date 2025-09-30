"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Loader2, CheckCircle2, Clock, FileText } from "lucide-react"
import Link from "next/link"
import type { Order } from "@/lib/types/database"
import Image from "next/image"

interface OrderDetailsProps {
  orderId: string
  userId: string
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-accent/10 text-accent", icon: Clock },
  payment_uploaded: { label: "Pago Subido", color: "bg-primary/10 text-primary", icon: Upload },
  confirmed: { label: "Confirmado", color: "bg-secondary/10 text-secondary", icon: CheckCircle2 },
  completed: { label: "Completado", color: "bg-secondary/10 text-secondary", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "bg-destructive/10 text-destructive", icon: FileText },
}

export function OrderDetails({ orderId, userId }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = () => {
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("orderId", orderId)

      const response = await fetch("/api/orders/upload-payment", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir el comprobante")
      }

      fetchOrder()
    } catch (error) {
      console.error("[v0] Error uploading payment:", error)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Orden no encontrada</p>
        </Card>
      </div>
    )
  }

  const status = statusConfig[order.status]
  const StatusIcon = status.icon
  const fromCurrency = order.order_type === "soles_to_bolivares" ? "PEN" : "VES"
  const toCurrency = order.order_type === "soles_to_bolivares" ? "VES" : "PEN"

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mis órdenes
      </Link>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">Orden #{order.order_number}</h1>
          <Badge className={status.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Creada el{" "}
          {new Date(order.created_at).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Order Summary */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Resumen de la Orden</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Envías</div>
            <div className="text-2xl font-bold text-foreground">
              {order.amount_send.toFixed(2)} {fromCurrency}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Recibes</div>
            <div className="text-2xl font-bold text-foreground">
              {order.amount_receive.toFixed(2)} {toCurrency}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-4">
          Tasa de cambio: 1 {fromCurrency} = {order.exchange_rate.toFixed(4)} {toCurrency}
        </div>
      </Card>

      {/* Banking Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Remitente</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground">Nombre</div>
              <div className="font-medium text-foreground">{order.sender_name}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Banco</div>
              <div className="font-medium text-foreground">{order.sender_bank}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Cuenta</div>
              <div className="font-medium text-foreground">{order.sender_account}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Beneficiario</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground">Nombre</div>
              <div className="font-medium text-foreground">{order.receiver_name}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Documento</div>
              <div className="font-medium text-foreground">{order.receiver_document}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Banco</div>
              <div className="font-medium text-foreground">{order.receiver_bank}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Cuenta</div>
              <div className="font-medium text-foreground">{order.receiver_account}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Proof Upload */}
      {order.status === "pending" && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Subir Comprobante de Pago</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Realiza la transferencia desde tu banco y sube el comprobante de pago para que podamos procesar tu orden.
          </p>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="payment-upload"
            />
            <label htmlFor="payment-upload">
              <Button disabled={uploading} className="bg-primary text-primary-foreground" asChild>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Comprobante
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        </Card>
      )}

      {/* Payment Proof Display */}
      {order.payment_proof_url && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">Comprobante de Pago</h3>
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden max-w-md">
            <Image
              src={order.payment_proof_url || "/placeholder.svg"}
              alt="Comprobante de pago"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Subido el{" "}
            {order.payment_uploaded_at &&
              new Date(order.payment_uploaded_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
          </p>
        </Card>
      )}

      {/* Notes */}
      {order.client_notes && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-2">Notas del Cliente</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{order.client_notes}</p>
        </Card>
      )}
    </div>
  )
}
