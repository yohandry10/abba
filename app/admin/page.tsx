import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdminLayout user={user}>
      <AdminDashboard />
    </AdminLayout>
  )
}
