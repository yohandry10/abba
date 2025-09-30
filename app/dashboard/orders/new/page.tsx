import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { NewOrderForm } from "@/components/orders/new-order-form"

export default async function NewOrderPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "client") {
    redirect("/admin")
  }

  if (user.status !== "active") {
    redirect("/onboarding")
  }

  return (
    <DashboardLayout user={user}>
      <NewOrderForm user={user} />
    </DashboardLayout>
  )
}
