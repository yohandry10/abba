import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { OrderDetails } from "@/components/orders/order-details"

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  const { id } = await params

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "client") {
    redirect("/admin")
  }

  return (
    <DashboardLayout user={user}>
      <OrderDetails orderId={id} userId={user.id} />
    </DashboardLayout>
  )
}
