import { Card } from "@/components/ui/card"
import { UserPlus, FileCheck, Calculator, Send } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Regístrate",
    description: "Crea tu cuenta y completa el proceso de verificación KYC con tus documentos",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Calculator,
    title: "Calcula tu cambio",
    description: "Usa nuestra calculadora para ver cuánto recibirás con las tasas actuales",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Send,
    title: "Realiza tu orden",
    description: "Completa los datos bancarios y realiza la transferencia desde tu banco",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: FileCheck,
    title: "Recibe tu dinero",
    description: "Sube el comprobante y recibe tu dinero en la cuenta destino en minutos",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Cómo Funciona</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cambiar tu dinero es fácil y seguro. Sigue estos simples pasos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mb-4`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <div className="text-sm font-semibold text-muted-foreground mb-2">Paso {index + 1}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
