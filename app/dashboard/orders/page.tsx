import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { OrdersList } from "@/components/dashboard/orders-list"

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "client") {
    redirect("/admin")
  }

  return (
    <DashboardLayout user={user}>
      <OrdersList userId={user.id} />
    </DashboardLayout>
  )
}
