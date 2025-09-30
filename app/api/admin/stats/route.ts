import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
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

    // Get stats
    const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

    const { count: pendingKYC } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_kyc")

    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "payment_uploaded", "confirmed"])

    const { count: completedOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")

    const { data: activeRate } = await supabase
      .from("exchange_rates")
      .select("soles_to_bolivares, bolivares_to_soles, published_at")
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      pendingKYC: pendingKYC || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      completedOrders: completedOrders || 0,
      activeRate,
    })
  } catch (error) {
    console.error("[v0] Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
