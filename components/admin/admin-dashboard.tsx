"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Clock, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ApprovedUsersList } from "./approved-users-list"
import { UsersSummary } from "./users-summary"
import { formatExchangeRate } from "@/lib/utils"

interface AdminStats {
  totalUsers: number
  pendingKYC: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  activeRate: {
    soles_to_bolivares: number
    bolivares_to_soles: number
    published_at: string
  } | null
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-xs sm:max-w-4xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Gestiona usuarios, tasas y órdenes</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Resumen</TabsTrigger>
          <TabsTrigger value="users" className="text-xs sm:text-sm">Usuarios Aprobados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total Usuarios</span>
          </div>
          {loading ? (
            <div className="h-6 sm:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats?.totalUsers || 0}</div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">KYC Pendientes</span>
          </div>
          {loading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-3xl font-bold text-foreground">{stats?.pendingKYC || 0}</div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Órdenes</span>
          </div>
          {loading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-3xl font-bold text-foreground">{stats?.totalOrders || 0}</div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Órdenes Pendientes</span>
          </div>
          {loading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-3xl font-bold text-foreground">{stats?.pendingOrders || 0}</div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Órdenes Completadas</span>
          </div>
          {loading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-3xl font-bold text-foreground">{stats?.completedOrders || 0}</div>
          )}
        </Card>
      </div>

      {/* Current Rates */}
      {stats?.activeRate && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Tasas Actuales</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">PEN → VES</div>
              <div className="text-2xl font-bold text-foreground">
                {formatExchangeRate(stats.activeRate.soles_to_bolivares)} Bs
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">VES → PEN</div>
              <div className="text-2xl font-bold text-foreground">
                {formatExchangeRate(stats.activeRate.bolivares_to_soles)} S/
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Última actualización:{" "}
            {new Date(stats.activeRate.published_at).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="users">
          <UsersSummary />
          <ApprovedUsersList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
