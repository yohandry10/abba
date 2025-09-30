import { getSupabaseServerClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string
    const userId = formData.get("userId") as string

    if (!file || !documentType || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`kyc/${userId}/${documentType}-${Date.now()}.${file.name.split(".").pop()}`, file, {
      access: "public",
    })

    // Save to database
    const supabase = await getSupabaseServerClient()
    const { error: dbError } = await supabase.from("kyc_documents").insert({
      user_id: userId,
      document_type: documentType,
      file_url: blob.url,
    })

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
    }

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
