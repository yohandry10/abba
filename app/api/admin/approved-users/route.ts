import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/get-user"

export async function GET(request: NextRequest) {
  try {
    console.log("=== STARTING APPROVED USERS API ===")
    
    // Skip user authentication for now to test the query
    const supabase = await getSupabaseServerClient()
    console.log("Supabase client created:", !!supabase)
    
    if (!supabase) {
      console.error("Failed to create Supabase client")
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get ALL users with status "active" and role "client"
    console.log("Querying users table...")
    const { data: users, error } = await supabase
      .from("users")
      .select(`
        id,
        email,
        full_name,
        phone,
        country,
        created_at,
        updated_at,
        approved_at,
        status,
        role
      `)
      .eq("status", "active")
      .eq("role", "client")
      .order("created_at", { ascending: false })

    console.log("Query completed. Error:", error)
    console.log("Found users:", users?.length || 0)
    
    if (error) {
      console.error("Error fetching approved users:", error)
      return NextResponse.json({ 
        error: "Failed to fetch users", 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }

    if (!users || users.length === 0) {
      console.log("No users found, returning empty array")
      return NextResponse.json([])
    }

    console.log("Users found:", users.map(u => ({ email: u.email, status: u.status, role: u.role })))

    // Process users without trying to get orders (simplify for now)
    console.log("Processing users...")
    const processedUsers = users.map((user) => {
      console.log("Processing user:", user.email)
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name || "Sin nombre",
        phone: user.phone,
        country: user.country,
        created_at: user.created_at,
        approved_at: user.approved_at || user.updated_at,
        total_orders: 0, // Simplified for now
        last_order_date: null // Simplified for now
      }
    })

    console.log("Processed users:", processedUsers.length)
    console.log("Returning data:", processedUsers)
    
    return NextResponse.json(processedUsers)
  } catch (error) {
    console.error("=== ERROR IN APPROVED USERS API ===")
    console.error("Error details:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}