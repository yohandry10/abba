"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types/database"
import { useEffect, useState } from "react"

interface DashboardOverviewProps {
  user: User
}

interface Stats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, pendingOrders: 0, completedOrders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/orders/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Bienvenido, {user.full_name}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Gestiona tus intercambios de moneda de forma fácil y segura</p>
      </div>

      {/* Account Status */}
      {user.status === "pending_kyc" && (
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6 border-accent bg-accent/5">
          <div className="flex items-start gap-3 sm:gap-4">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">Verificación Pendiente</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Tu cuenta está en proceso de verificación. Te notificaremos cuando esté lista.
              </p>
              <Link href="/onboarding">
                <Button size="sm" variant="outline" className="bg-transparent text-xs sm:text-sm">
                  Ver Estado
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Calcular Cambio</h3>
          <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
            Usa nuestra calculadora para ver cuánto recibirás con las tasas actuales
          </p>
          <Link href="/dashboard/calculator">
            <Button className="w-full bg-primary text-primary-foreground text-sm sm:text-base h-9 sm:h-10">Calcular y Enviar</Button>
          </Link>
        </Card>

        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-2 hover:border-accent/50">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Mis Órdenes</h3>
          <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
            Revisa el estado de tus intercambios y sube comprobantes de pago
          </p>
          <Link href="/dashboard/orders">
            <Button className="w-full bg-accent text-accent-foreground text-sm sm:text-base h-9 sm:h-10">Ver Órdenes</Button>
          </Link>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground">Total de Órdenes</span>
          </div>
          {loading ? (
            <div className="h-6 sm:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats.totalOrders}</div>
          )}
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <span className="text-xs sm:text-sm text-muted-foreground">En Proceso</span>
          </div>
          {loading ? (
            <div className="h-6 sm:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats.pendingOrders}</div>
          )}
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            <span className="text-xs sm:text-sm text-muted-foreground">Completadas</span>
          </div>
          {loading ? (
            <div className="h-6 sm:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats.completedOrders}</div>
          )}
        </Card>
      </div>
    </div>
  )
}
