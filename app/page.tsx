import { ModernNavbar } from "@/components/modern-navbar"
import { HeroSlider } from "@/components/hero-slider"
import { CurrencyCalculator } from "@/components/currency-calculator"
import { ClientOrderSection } from "@/components/client-order-section"
import { RatesSection } from "@/components/rates-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { MissionVision } from "@/components/mission-vision"
import { ModernFooter } from "@/components/modern-footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ModernNavbar />
      <HeroSlider />
      <CurrencyCalculator />
      <ClientOrderSection />
      <RatesSection />
      <WhyChooseUs />
      <MissionVision />
      <ModernFooter />
    </main>
  )
}
