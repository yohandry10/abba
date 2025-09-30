"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, RefreshCw, Wifi, WifiOff, Bell } from "lucide-react"
import Link from "next/link"
import { useRealtimeOrders } from "@/lib/hooks/use-realtime-orders"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Order } from "@/lib/types/database"

interface AdminOrdersListProps {
  adminId: string
}

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-accent/10 text-accent" },
  payment_uploaded: { label: "Pago Subido", color: "bg-primary/10 text-primary" },
  confirmed: { label: "Confirmado", color: "bg-secondary/10 text-secondary" },
  completed: { label: "Completado", color: "bg-secondary/10 text-secondary" },
  cancelled: { label: "Cancelado", color: "bg-destructive/10 text-destructive" },
}

export function AdminOrdersList({ adminId }: AdminOrdersListProps) {
  const { orders, loading, error, refreshOrders } = useRealtimeOrders({ isAdmin: true })
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isOnline, setIsOnline] = useState(true)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const supabase = getSupabaseBrowserClient()

  // Monitor connection status
  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel('admin-connection-status')
    
    channel.on('system', {}, (payload) => {
      if (payload.event === 'connected') {
        setIsOnline(true)
      } else if (payload.event === 'disconnected') {
        setIsOnline(false)
      }
    })

    // Monitor new orders for notification badge
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders'
      },
      () => {
        setNewOrdersCount(prev => prev + 1)
        // Auto-reset after 5 seconds
        setTimeout(() => setNewOrdersCount(0), 5000)
      }
    )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [searchTerm, orders])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">Gestión de Órdenes</h1>
              <div className="flex items-center gap-2">
                {newOrdersCount > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs animate-pulse">
                    <Bell className="w-3 h-3" />
                    {newOrdersCount} nueva{newOrdersCount > 1 ? 's' : ''}
                  </div>
                )}
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
              Revisa y procesa las órdenes de cambio • Actualizaciones en tiempo real
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por número de orden, remitente o beneficiario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-20 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron órdenes</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Intenta con otro término de búsqueda" : "No hay órdenes registradas"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status]

            return (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-sm font-medium text-foreground">#{order.order_number}</span>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Monto</div>
                        <div className="font-semibold text-foreground">
                          {order.amount_send.toFixed(2)} {order.order_type === "soles_to_bolivares" ? "PEN" : "VES"} →{" "}
                          {order.amount_receive.toFixed(2)} {order.order_type === "soles_to_bolivares" ? "VES" : "PEN"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Remitente → Beneficiario</div>
                        <div className="text-sm text-foreground">
                          {order.sender_name} → {order.receiver_name}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <Link href={`/admin/orders/${order.id}`}>
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
