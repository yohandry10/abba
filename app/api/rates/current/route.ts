import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      // Return demo data when Supabase is not configured
      return NextResponse.json({
        soles_to_bolivares: 13.5,
        bolivares_to_soles: 0.0741,
        published_at: new Date().toISOString(),
      })
    }

    const { data, error } = await supabase
      .from("exchange_rates")
      .select("soles_to_bolivares, bolivares_to_soles, published_at")
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("[v0] Error fetching exchange rates:", error.message)
      return NextResponse.json({
        soles_to_bolivares: 13.5,
        bolivares_to_soles: 0.0741,
        published_at: new Date().toISOString(),
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({
      soles_to_bolivares: 13.5,
      bolivares_to_soles: 0.0741,
      published_at: new Date().toISOString(),
    })
  }
}
