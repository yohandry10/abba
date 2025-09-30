import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/get-user"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServerClient()
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get user counts by status
    const { data: userCounts, error: countsError } = await supabase
      .from("users")
      .select("status")
      .eq("role", "client")

    if (countsError) {
      console.error("Error fetching user counts:", countsError)
      return NextResponse.json({ error: "Failed to fetch user counts" }, { status: 500 })
    }

    // Calculate counts
    const total = userCounts?.length || 0
    const active = userCounts?.filter(u => u.status === "active").length || 0
    const pending_kyc = userCounts?.filter(u => u.status === "pending_kyc").length || 0
    const suspended = userCounts?.filter(u => u.status === "suspended").length || 0

    // Get recent approvals (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentApprovals, error: approvalsError } = await supabase
      .from("users")
      .select("id, full_name, email, approved_at")
      .eq("role", "client")
      .eq("status", "active")
      .not("approved_at", "is", null)
      .gte("approved_at", sevenDaysAgo.toISOString())
      .order("approved_at", { ascending: false })
      .limit(5)

    if (approvalsError) {
      console.error("Error fetching recent approvals:", approvalsError)
    }

    const summary = {
      total,
      active,
      pending_kyc,
      suspended,
      recent_approvals: recentApprovals || []
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error in users summary API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}