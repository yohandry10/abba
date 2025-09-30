'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!supabase) {
        setError('Supabase no está configurado en el cliente.')
        return
      }

      // 1) Autenticar
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Credenciales inválidas')
        return
      }
      const user = data.user
      if (!user) {
        setError('No se obtuvo el usuario autenticado')
        return
      }

      // 2) Leer perfil en public.users (RLS + JWT del usuario)
      const { data: userRow, error: userErr } = await supabase
        .from('users')
        .select('role,status')
        .eq('id', user.id)
        .single()

      if (userErr || !userRow) {
        setError('Error al obtener perfil: ' + (userErr?.message ?? 'desconocido'))
        return
      }

      if (userRow.status === 'suspended') {
        await supabase.auth.signOut()
        setError('Tu cuenta ha sido suspendida. Contacta al administrador.')
        return
      }

      // 3) Redirigir por rol
      if (userRow.role === 'admin') {
        router.push('/admin')
      } else {
        // Los clientes van al inicio, no a un dashboard separado
        router.push('/')
      }
    } catch (err: any) {
      setError(err?.message ?? 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-2 sm:p-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Volver al inicio
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg sm:text-2xl">AC</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Accede a tu cuenta de Abba Cambios</p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2 sm:p-3 text-xs sm:text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 sm:h-9 w-full min-w-0 rounded-md border px-2 sm:px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                placeholder="admin@abbacambios.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 sm:h-9 w-full min-w-0 rounded-md border px-2 sm:px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 sm:px-4 py-2 sm:py-2.5 text-primary-foreground font-medium shadow-sm disabled:opacity-50 text-sm sm:text-base h-9 sm:h-10"
            >
              {loading ? 'Ingresando…' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <Link href="/register" className="text-primary hover:underline font-medium">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
