"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Intentando login con:", email)

    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        setError("Error de configuración. Verifica las variables de entorno.")
        setLoading(false)
        return
      }

      console.log("Cliente Supabase creado correctamente")

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Respuesta de auth:", { data, error: signInError })

      if (signInError) {
        setError(`Error de autenticación: ${signInError.message}`)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("No se pudo obtener información del usuario")
        setLoading(false)
        return
      }

      console.log("Usuario autenticado:", data.user.id)

      // Get user role from database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, status")
        .eq("id", data.user.id)
        .single()

      console.log("Datos del usuario:", { userData, error: userError })

      if (userError) {
        setError(`Error al obtener perfil: ${userError.message}`)
        setLoading(false)
        return
      }

      if (!userData) {
        setError("No se encontró el perfil del usuario")
        setLoading(false)
        return
      }

      console.log("Redirigiendo usuario con rol:", userData.role)

      // Redirect based on role
      if (userData.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(`Error inesperado: ${err instanceof Error ? err.message : 'Error desconocido'}`)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {error && (
        <div className="p-2 sm:p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs sm:text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground text-sm sm:text-base">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="bg-background h-10 sm:h-11 text-sm sm:text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground text-sm sm:text-base">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="bg-background h-10 sm:h-11 text-sm sm:text-base"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 sm:h-11 text-sm sm:text-base"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            <span className="text-xs sm:text-sm">Iniciando sesión...</span>
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  )
}
