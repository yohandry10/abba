import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // ¡NO expongas esta en el cliente!
  if (!url || !serviceKey) throw new Error('SUPABASE env vars missing')
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}
