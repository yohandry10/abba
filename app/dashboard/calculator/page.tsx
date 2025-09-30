import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardCalculator } from "@/components/dashboard/dashboard-calculator"

export default async function CalculatorPage() {
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
      <DashboardCalculator user={user} />
    </DashboardLayout>
  )
}