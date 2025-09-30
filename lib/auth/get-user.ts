import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { User } from "@/lib/types/database"

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return null
    }

    const { data: userData, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

    if (error || !userData) {
      return null
    }

    return userData as User
  } catch (error) {
    console.error("[v0] Error getting current user:", error)
    return null
  }
}
