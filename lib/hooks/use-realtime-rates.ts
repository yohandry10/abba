"use client"

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { ExchangeRate } from '@/lib/types/database'

export function useRealtimeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [currentRate, setCurrentRate] = useState<ExchangeRate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (!supabase) return

    const loadRates = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar todas las tasas
        const { data: allRates, error: ratesError } = await supabase
          .from('exchange_rates')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(10)

        if (ratesError) {
          console.error('Error fetching rates:', ratesError)
          throw ratesError
        }

        setRates(allRates || [])

        // Encontrar la tasa activa
        const activeRate = allRates?.find((rate: any) => rate.is_active)
        setCurrentRate(activeRate || null)

      } catch (err) {
        console.error('Error loading rates:', err)
        setError('Error al cargar las tasas de cambio')
      } finally {
        setLoading(false)
      }
    }

    loadRates()

    // Suscribirse a cambios en tasas de cambio
    const channel = supabase
      .channel('rates-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'exchange_rates'
        },
        (payload: any) => {
          const newRate = payload.new as ExchangeRate

          // Agregar nueva tasa al inicio
          setRates(prev => [newRate, ...prev.slice(0, 9)])

          // Si es activa, actualizar tasa actual
          if (newRate.is_active) {
            setCurrentRate(newRate)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'exchange_rates'
        },
        (payload: any) => {
          const updatedRate = payload.new as ExchangeRate

          // Actualizar en la lista
          setRates(prev =>
            prev.map((rate: any) =>
              rate.id === updatedRate.id ? updatedRate : rate
            )
          )

          // Si se desactivó la tasa actual, buscar nueva activa
          if (!updatedRate.is_active && currentRate?.id === updatedRate.id) {
            setCurrentRate(null)
            // Buscar otra tasa activa
            setRates(prev => {
              const activeRate = prev.find((r: any) => r.is_active && r.id !== updatedRate.id)
              if (activeRate) {
                setCurrentRate(activeRate)
              }
              return prev
            })
          }

          // Si se activó, establecer como actual
          if (updatedRate.is_active) {
            setCurrentRate(updatedRate)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentRate?.id])

  const refreshRates = async () => {
    if (!supabase) return

    try {
      const { data: allRates, error: ratesError } = await supabase
        .from('exchange_rates')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10)

      if (ratesError) {
        throw ratesError
      }

      setRates(allRates || [])

      const activeRate = allRates?.find((rate: any) => rate.is_active)
      setCurrentRate(activeRate || null)

    } catch (err) {
      console.error('Error refreshing rates:', err)
      setError('Error al actualizar las tasas de cambio')
    }
  }

  return {
    rates,
    currentRate,
    loading,
    error,
    refreshRates
  }
}