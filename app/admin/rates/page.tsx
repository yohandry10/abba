import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { AdminLayout } from "@/components/admin/admin-layout"
import { RateManagement } from "@/components/admin/rate-management"

export default async function RatesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdminLayout user={user}>
      <RateManagement userId={user.id} />
    </AdminLayout>
  )
}
