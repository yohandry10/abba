"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface ClientActionButtonsProps {
  result: number | null
  fromCurrency: string
  rates: any
}

export function ClientActionButtons({ result, fromCurrency, rates }: ClientActionButtonsProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user)
        if (user) {
          supabase
            .from("users")
            .select("role, status")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
              setUserRole(data?.role || null)
            })
        }
      })
    }
  }, [])

  const createOrder = () => {
    if (!result || !rates) return
    
    // Crear orden con los datos calculados
    const orderData = {
      amount_from: parseFloat(document.getElementById("amount")?.value || "0"),
      currency_from: fromCurrency,
      currency_to: fromCurrency === "PEN" ? "VES" : "PEN",
      amount_to: result,
      exchange_rate: fromCurrency === "PEN" ? rates.soles_to_bolivares : rates.bolivares_to_soles
    }
    
    // Guardar en localStorage para usar en el formulario
    localStorage.setItem("orderData", JSON.stringify(orderData))
    
    // Scroll to order form
    const orderSection = document.getElementById("crear-orden")
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!user) {
    // Usuario no logueado
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link href="/register" className="flex-1">
          <Button className="w-full h-10 sm:h-12 bg-primary text-primary-foreground text-sm sm:text-base">
            Registrarse para Cambiar
          </Button>
        </Link>
        <Link href="/login" className="flex-1">
          <Button variant="outline" className="w-full h-10 sm:h-12 text-sm sm:text-base">
            Ya tengo cuenta
          </Button>
        </Link>
      </div>
    )
  }

  if (userRole === "client" && result) {
    // Cliente logueado con resultado calculado
    return (
      <div className="flex flex-col gap-3">
        <Button 
          onClick={createOrder}
          className="w-full h-10 sm:h-12 bg-primary text-primary-foreground text-sm sm:text-base"
        >
          Crear Orden de Cambio
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Se creará una orden para cambiar {parseFloat(document.getElementById("amount")?.value || "0")} {fromCurrency} por {result.toFixed(8)} {fromCurrency === "PEN" ? "VES" : "PEN"}
        </p>
      </div>
    )
  }

  // Cliente logueado sin resultado
  return (
    <div className="text-center text-sm text-muted-foreground">
      Ingresa una cantidad para calcular el cambio
    </div>
  )
}