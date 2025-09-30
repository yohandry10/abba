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

    const body = await request.json()
    const {
      orderType,
      amountSend,
      amountReceive,
      exchangeRate,
      senderName,
      senderBank,
      senderAccount,
      receiverName,
      receiverBank,
      receiverAccount,
      receiverDocument,
      clientNotes,
    } = body

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Create order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        client_id: user.id,
        order_type: orderType,
        amount_send: amountSend,
        amount_receive: amountReceive,
        exchange_rate: exchangeRate,
        sender_name: senderName,
        sender_bank: senderBank,
        sender_account: senderAccount,
        receiver_name: receiverName,
        receiver_bank: receiverBank,
        receiver_account: receiverAccount,
        receiver_document: receiverDocument,
        client_notes: clientNotes || null,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating order:", error)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
