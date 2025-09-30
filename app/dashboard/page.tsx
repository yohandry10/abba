import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "client") {
    redirect("/admin")
  }

  if (user.status === "pending_kyc") {
    redirect("/onboarding")
  }

  return (
    <DashboardLayout user={user}>
      <DashboardOverview user={user} />
    </DashboardLayout>
  )
}
