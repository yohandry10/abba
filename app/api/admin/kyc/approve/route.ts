import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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

    const { userId } = await request.json()

    // Update user status and set approved_at timestamp
    const { error: updateError } = await supabase
      .from("users")
      .update({ 
        status: "active",
        approved_at: new Date().toISOString()
      })
      .eq("id", userId)

    if (updateError) {
      console.error("[v0] Error updating user:", updateError)
      return NextResponse.json({ error: "Failed to approve user" }, { status: 500 })
    }

    // Mark documents as verified
    await supabase
      .from("kyc_documents")
      .update({ verified: true, verified_at: new Date().toISOString(), verified_by: user.id })
      .eq("user_id", userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
