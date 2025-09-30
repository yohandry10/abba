"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle2, XCircle, Upload, RefreshCw, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import { useRealtimeOrders } from "@/lib/hooks/use-realtime-orders"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface OrdersListProps {
  userId: string
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-accent/10 text-accent", icon: Clock },
  payment_uploaded: { label: "Pago Subido", color: "bg-primary/10 text-primary", icon: Upload },
  confirmed: { label: "Confirmado", color: "bg-secondary/10 text-secondary", icon: CheckCircle2 },
  completed: { label: "Completado", color: "bg-secondary/10 text-secondary", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "bg-destructive/10 text-destructive", icon: XCircle },
}

export function OrdersList({ userId }: OrdersListProps) {
  const { orders, loading, error, refreshOrders } = useRealtimeOrders({ userId })
  const [isOnline, setIsOnline] = useState(true)
  const supabase = getSupabaseBrowserClient()

  // Monitor connection status
  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel('connection-status')
    
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Mis Órdenes</h1>
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
                onClick={refreshOrders}
                disabled={loading}
                className="h-7"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Gestiona y revisa el estado de tus intercambios • Actualizaciones en tiempo real
          </p>
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>
        <Link href="/dashboard/calculator">
          <Button className="bg-accent text-accent-foreground">Nueva Orden</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-20 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No tienes órdenes aún</h3>
          <p className="text-muted-foreground mb-6">Crea tu primera orden usando la calculadora</p>
          <Link href="/dashboard/calculator">
            <Button className="bg-primary text-primary-foreground">Ir a Calculadora</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status]
            const StatusIcon = status.icon

            return (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">#{order.order_number}</span>
                      <Badge className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-lg font-semibold text-foreground mb-1">
                      {order.amount_send.toFixed(2)} {order.order_type === "soles_to_bolivares" ? "PEN" : "VES"} →{" "}
                      {order.amount_receive.toFixed(2)} {order.order_type === "soles_to_bolivares" ? "VES" : "PEN"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline" className="bg-transparent">
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
