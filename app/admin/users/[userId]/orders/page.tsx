import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { AdminLayout } from "@/components/admin/admin-layout"
import { UserOrdersView } from "@/components/admin/user-orders-view"

interface PageProps {
  params: {
    userId: string
  }
}

export default async function UserOrdersPage({ params }: PageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdminLayout user={user}>
      <UserOrdersView userId={params.userId} />
    </AdminLayout>
  )
}