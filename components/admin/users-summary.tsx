"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, UserX, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface UsersSummary {
  total: number
  active: number
  pending_kyc: number
  suspended: number
  recent_approvals: Array<{
    id: string
    full_name: string
    email: string
    approved_at: string
  }>
}

export function UsersSummary() {
  const [summary, setSummary] = useState<UsersSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsersSummary()
  }, [])

  const fetchUsersSummary = async () => {
    try {
      const response = await fetch("/api/admin/users/summary")
      if (response.ok) {
        const data = await response.json()
        setSummary(data)
      }
    } catch (error) {
      console.error("Error fetching users summary:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{summary.total}</div>
              <div className="text-sm text-muted-foreground">Total Usuarios</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{summary.active}</div>
              <div className="text-sm text-muted-foreground">Activos</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{summary.pending_kyc}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{summary.suspended}</div>
              <div className="text-sm text-muted-foreground">Suspendidos</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Approvals */}
      {summary.recent_approvals.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Aprobaciones Recientes</h3>
          <div className="space-y-3">
            {summary.recent_approvals.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{user.full_name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">Aprobado</Badge>
                  <div className="text-xs text-muted-foreground">
                    {new Date(user.approved_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}