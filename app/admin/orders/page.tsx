import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminOrdersList } from "@/components/admin/admin-orders-list"

export default async function AdminOrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdminLayout user={user}>
      <AdminOrdersList adminId={user.id} />
    </AdminLayout>
  )
}
