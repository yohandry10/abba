import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data: rates, error } = await supabase
      .from("exchange_rates")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("[v0] Error fetching rates:", error)
      return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 })
    }

    return NextResponse.json(rates)
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin role
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { soles_to_bolivares, bolivares_to_soles } = body
    
    console.log("Received rates:", { soles_to_bolivares, bolivares_to_soles })
    console.log("Types:", { 
      soles_type: typeof soles_to_bolivares, 
      bolivares_type: typeof bolivares_to_soles 
    })

    // Deactivate all previous rates
    await supabase.from("exchange_rates").update({ is_active: false }).eq("is_active", true)

    // Insert new rate
    const { data: newRate, error } = await supabase
      .from("exchange_rates")
      .insert({
        soles_to_bolivares,
        bolivares_to_soles,
        published_by: user.id,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating rate:", error)
      return NextResponse.json({ error: "Failed to create rate" }, { status: 500 })
    }

    console.log("Created rate:", newRate)
    return NextResponse.json(newRate)
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
