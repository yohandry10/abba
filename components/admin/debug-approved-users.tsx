"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function DebugApprovedUsers() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      console.log("Testing approved users API...")
      const response = await fetch("/api/admin/approved-users")
      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)
      
      const data = await response.json()
      console.log("Response data:", data)
      
      setDebugInfo({
        status: response.status,
        ok: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("Error testing API:", error)
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Debug: Usuarios Aprobados</h3>
      <Button onClick={testAPI} disabled={loading} className="mb-4">
        {loading ? "Probando..." : "Probar API"}
      </Button>
      
      {debugInfo && (
        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  )
}