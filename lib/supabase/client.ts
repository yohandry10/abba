//client.ts
import { createBrowserClient } from '@supabase/ssr'

let client: any = null

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Supabase not configured")
    return null
  }

  if (client) {
    return client
  }

  try {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
    return client
  } catch (error) {
    console.log("[v0] Error creating Supabase client:", error)
    return null
  }
}

// Hook para manejar subscripciones de realtime
export function useRealtimeSubscription(
  table: string,
  filter?: string,
  callback?: (payload: any) => void
) {
  const supabase = getSupabaseBrowserClient()
  
  if (!supabase) return null

  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table,
        filter 
      },
      (payload: any) => {
        console.log(`[Realtime] ${table} change:`, payload)
        callback?.(payload)
      }
    )
    .subscribe()

  return channel
}
