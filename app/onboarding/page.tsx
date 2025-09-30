import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { KYCOnboardingFlow } from "@/components/onboarding/kyc-onboarding-flow"

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // If user is already active, redirect to dashboard
  if (user.status === "active") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <KYCOnboardingFlow user={user} />
      </div>
    </div>
  )
}
