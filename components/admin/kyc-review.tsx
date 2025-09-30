"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Image from "next/image"

interface KYCReviewProps {
  adminId: string
}

interface KYCUser {
  id: string
  full_name: string
  email: string
  phone: string
  created_at: string
  documents: {
    id: string
    document_type: string
    file_url: string
    uploaded_at: string
  }[]
}

export function KYCReview({ adminId }: KYCReviewProps) {
  const [users, setUsers] = useState<KYCUser[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingKYC()
    
    // Set up realtime subscription for user status changes
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      const channel = supabase
        .channel('kyc-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: 'status=eq.pending_kyc'
          },
          () => {
            fetchPendingKYC() // Refresh when user status changes
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  const fetchPendingKYC = () => {
    fetch("/api/admin/kyc/pending")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleApprove = async (userId: string) => {
    setProcessing(userId)
    try {
      const response = await fetch("/api/admin/kyc/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        fetchPendingKYC()
      }
    } catch (error) {
      console.error("[v0] Error approving KYC:", error)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId: string) => {
    setProcessing(userId)
    try {
      const response = await fetch("/api/admin/kyc/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        fetchPendingKYC()
      }
    } catch (error) {
      console.error("[v0] Error rejecting KYC:", error)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Verificación KYC</h1>
        <p className="text-muted-foreground">Revisa y aprueba documentos de identidad de usuarios</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-40 bg-muted animate-pulse rounded" />
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay verificaciones pendientes</h3>
          <p className="text-muted-foreground">Todos los usuarios han sido verificados</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {users.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <Badge className="bg-accent/10 text-accent">Pendiente</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {user.documents.map((doc) => (
                  <div key={doc.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <FileText className="w-4 h-4" />
                      {doc.document_type === "dni_front"
                        ? "DNI Frontal"
                        : doc.document_type === "dni_back"
                          ? "DNI Reverso"
                          : "Selfie"}
                    </div>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={doc.file_url || "/placeholder.svg"}
                        alt={doc.document_type}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Ver en tamaño completo
                    </a>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => handleReject(user.id)}
                  disabled={processing === user.id}
                  variant="outline"
                  className="flex-1 bg-transparent text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  {processing === user.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Rechazar
                </Button>
                <Button
                  onClick={() => handleApprove(user.id)}
                  disabled={processing === user.id}
                  className="flex-1 bg-secondary text-secondary-foreground"
                >
                  {processing === user.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Aprobar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
