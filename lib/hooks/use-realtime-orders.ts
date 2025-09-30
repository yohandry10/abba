"use client"

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/types/database'

interface UseRealtimeOrdersProps {
  userId?: string
  isAdmin?: boolean
}

export function useRealtimeOrders({ userId, isAdmin = false }: UseRealtimeOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (!supabase || (!userId && !isAdmin)) return

    const loadOrders = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase.from('orders').select('*')

        if (!isAdmin && userId) {
          query = query.eq('client_id', userId)
        }

        const { data, error: fetchError } = await query.order('created_at', { ascending: false })

        if (fetchError) {
          throw fetchError
        }

        setOrders(data || [])
      } catch (err) {
        console.error('Error loading orders:', err)
        setError('Error al cargar las órdenes')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()

    // Configurar filtro para subscripción
    let filter = undefined
    if (!isAdmin && userId) {
      filter = `client_id=eq.${userId}`
    }

    // Suscribirse a cambios en órdenes
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter
        },
        (payload) => {
          const newOrder = payload.new as Order
          setOrders(prev => [newOrder, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter
        },
        (payload) => {
          const updatedOrder = payload.new as Order
          setOrders(prev => 
            prev.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            )
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'orders',
          filter
        },
        (payload) => {
          const deletedOrder = payload.old as Order
          setOrders(prev => prev.filter(order => order.id !== deletedOrder.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId, isAdmin])

  const refreshOrders = async () => {
    if (!supabase) return

    try {
      let query = supabase.from('orders').select('*')

      if (!isAdmin && userId) {
        query = query.eq('client_id', userId)
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      setOrders(data || [])
    } catch (err) {
      console.error('Error refreshing orders:', err)
      setError('Error al actualizar las órdenes')
    }
  }

  return {
    orders,
    loading,
    error,
    refreshOrders
  }
}