"use client"

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Monitor browser online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Monitor Supabase connection
    if (supabase) {
      const channel = supabase.channel('connection-monitor')
      
      channel.on('system', {}, (payload) => {
        if (payload.event === 'connected') {
          setIsSupabaseConnected(true)
          if (!isSupabaseConnected) {
            toast.success('Conexión restaurada', {
              description: 'Las actualizaciones en tiempo real están funcionando'
            })
          }
        } else if (payload.event === 'disconnected') {
          setIsSupabaseConnected(false)
          toast.error('Conexión perdida', {
            description: 'Intentando reconectar...'
          })
        }
      })

      channel.subscribe()

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        supabase.removeChannel(channel)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [supabase, isSupabaseConnected])

  const isFullyConnected = isOnline && isSupabaseConnected

  if (isFullyConnected) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
        <Wifi className="w-3 h-3" />
        <span className="hidden sm:inline">En línea</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
      {!isOnline ? (
        <>
          <WifiOff className="w-3 h-3" />
          <span className="hidden sm:inline">Sin internet</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3" />
          <span className="hidden sm:inline">Reconectando...</span>
        </>
      )}
    </div>
  )
}