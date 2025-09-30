"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QuickUserCheck() {
  const [email, setEmail] = useState("")
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkUser = async () => {
    if (!email) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/check-user?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setUserInfo(data)
    } catch (error) {
      console.error("Error checking user:", error)
      setUserInfo({ error: "Error al verificar usuario" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Verificar Usuario Específico</h3>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Label htmlFor="email">Email del usuario</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button onClick={checkUser} disabled={loading || !email} className="mt-6">
          {loading ? "Verificando..." : "Verificar"}
        </Button>
      </div>
      
      {userInfo && (
        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  )
}