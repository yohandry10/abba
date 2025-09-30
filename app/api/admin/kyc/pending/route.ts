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

    // Get users with pending KYC
    const { data: pendingUsers, error: usersError } = await supabase
      .from("users")
      .select("id, full_name, email, phone, created_at")
      .eq("status", "pending_kyc")
      .order("created_at", { ascending: true })

    if (usersError) {
      console.error("[v0] Error fetching pending users:", usersError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Get documents for each user
    const usersWithDocuments = await Promise.all(
      pendingUsers.map(async (user) => {
        const { data: documents } = await supabase
          .from("kyc_documents")
          .select("id, document_type, file_url, uploaded_at")
          .eq("user_id", user.id)
          .order("uploaded_at", { ascending: true })

        return {
          ...user,
          documents: documents || [],
        }
      }),
    )

    return NextResponse.json(usersWithDocuments)
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
