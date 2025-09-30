"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  ArrowLeft,
  User,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface UserOrder {
  id: string
  amount_from: number
  amount_to: number
  currency_from: string
  currency_to: string
  status: string
  created_at: string
  updated_at: string
  exchange_rate: number
}

interface UserInfo {
  id: string
  email: string
  full_name: string
  phone: string | null
  country: string | null
  created_at: string
  approved_at: string | null
}

interface UserOrdersViewProps {
  userId: string
}

export function UserOrdersView({ userId }: UserOrdersViewProps) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const [userResponse, ordersResponse] = await Promise.all([
        fetch(`/api/admin/users/${userId}`),
        fetch(`/api/admin/users/${userId}/orders`)
      ])

      if (userResponse.ok && ordersResponse.ok) {
        const userData = await userResponse.json()
        const ordersData = await ordersResponse.json()
        setUser(userData)
        setOrders(ordersData)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pendiente", icon: Clock },
      processing: { variant: "default" as const, label: "Procesando", icon: AlertCircle },
      completed: { variant: "default" as const, label: "Completado", icon: CheckCircle2 },
      cancelled: { variant: "destructive" as const, label: "Cancelado", icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getTotalStats = () => {
    const totalOrders = orders.length
    const completedOrders = orders.filter(o => o.status === "completed").length
    const totalVolume = orders
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + o.amount_from, 0)

    return { totalOrders, completedOrders, totalVolume }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Usuario no encontrado</h3>
        <Link href="/admin">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Admin
          </Button>
        </Link>
      </div>
    )
  }

  const stats = getTotalStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Órdenes de {user.full_name}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Cliente desde</div>
            <div className="font-semibold">
              {format(new Date(user.created_at), "dd MMM yyyy", { locale: es })}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Aprobado</div>
            <div className="font-semibold">
              {user.approved_at 
                ? format(new Date(user.approved_at), "dd MMM yyyy", { locale: es })
                : "Pendiente"
              }
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Teléfono</div>
            <div className="font-semibold">{user.phone || "No especificado"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">País</div>
            <div className="font-semibold">{user.country || "No especificado"}</div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Órdenes</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.totalOrders}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
            <span className="text-sm text-muted-foreground">Completadas</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.completedOrders}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Volumen Total</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {stats.totalVolume.toFixed(2)}
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Historial de Órdenes
          </h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Sin órdenes
              </h4>
              <p className="text-muted-foreground">
                Este usuario aún no ha realizado ninguna orden
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cambio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Tasa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(order.created_at), "dd MMM yyyy", { locale: es })}
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(order.created_at), "HH:mm")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {order.currency_from} → {order.currency_to}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.amount_from.toFixed(2)} {order.currency_from}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            → {order.amount_to.toFixed(2)} {order.currency_to}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {order.exchange_rate.toFixed(4)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}