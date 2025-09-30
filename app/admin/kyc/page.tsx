import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/get-user"
import { AdminLayout } from "@/components/admin/admin-layout"
import { KYCReview } from "@/components/admin/kyc-review"

export default async function KYCPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdminLayout user={user}>
      <KYCReview adminId={user.id} />
    </AdminLayout>
  )
}
