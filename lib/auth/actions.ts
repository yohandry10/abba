'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signIn(email: string, password: string) {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return { error: 'Error de configuración del servidor' }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'Credenciales inválidas' }

  // Leer rol/estado desde public.users con RLS
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role, status')
    .eq('id', data.user.id)
    .single()

  if (userError || !userData) return { error: 'Error al obtener información del usuario' }

  if (userData.status === 'suspended') {
    await supabase.auth.signOut()
    return { error: 'Tu cuenta ha sido suspendida. Contacta al administrador.' }
  }

  revalidatePath('/', 'layout')
  if (userData.role === 'admin') redirect('/admin')
  redirect('/dashboard')
}

export async function signUp(email: string, password: string, fullName: string, phone?: string) {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return { error: 'Error de configuración del servidor' }

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) return { error: authError.message }
  if (!authData.user) return { error: 'Error al crear el usuario' }

  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      phone: phone || null,
      role: 'client',
      status: 'pending_kyc',
    })

  if (userError) {
    // Limpieza correcta con SERVICE ROLE KEY
    try {
      const admin = getSupabaseAdminClient()
      await admin.auth.admin.deleteUser(authData.user.id)
    } catch {}
    return { error: 'Error al crear el perfil de usuario' }
  }

  return { success: true, message: 'Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.' }
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return { error: 'Error de configuración del servidor' }
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function resetPassword(email: string) {
  const supabase = await getSupabaseServerClient()
  if (!supabase) return { error: 'Error de configuración del servidor' }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })
  if (error) return { error: error.message }

  return { success: true, message: 'Se ha enviado un enlace de recuperación a tu email.' }
}
