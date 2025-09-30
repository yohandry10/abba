"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Upload, FileText, Camera, ArrowRight, ArrowLeft } from "lucide-react"
import type { User } from "@/lib/types/database"
import { DocumentUploadStep } from "./document-upload-step"
import { useRouter } from "next/navigation"

interface KYCOnboardingFlowProps {
  user: User
}

type Step = "welcome" | "dni_front" | "dni_back" | "review" | "pending"

export function KYCOnboardingFlow({ user }: KYCOnboardingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("welcome")
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    dni_front?: string
    dni_back?: string
  }>({})

  const steps = [
    { id: "welcome", label: "Bienvenida", icon: CheckCircle2 },
    { id: "dni_front", label: "DNI Frontal", icon: FileText },
    { id: "dni_back", label: "DNI Reverso", icon: FileText },
    { id: "review", label: "Revisión", icon: CheckCircle2 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleDocumentUploaded = (documentType: string, url: string) => {
    setUploadedDocuments((prev) => ({ ...prev, [documentType]: url }))

    // Move to next step
    if (documentType === "dni_front") {
      setCurrentStep("dni_back")
    } else if (documentType === "dni_back") {
      setCurrentStep("review")
    }
  }

  const handleSubmit = async () => {
    setCurrentStep("pending")
    // In a real app, this would trigger admin review
    // For now, we'll just show the pending state
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">Verificación KYC</h2>
          <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  index <= currentStepIndex
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-2 text-center text-muted-foreground whitespace-nowrap">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 transition-colors ${index < currentStepIndex ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <Card className="p-8">
        {currentStep === "welcome" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-foreground">Bienvenido, {user.full_name}</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Para garantizar la seguridad de todas las transacciones, necesitamos verificar tu identidad. Este proceso
              es rápido y solo lo harás una vez.
            </p>
            <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3 text-foreground">Necesitarás:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Foto del frente de tu DNI o documento de identidad
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Foto del reverso de tu DNI o documento de identidad
                </li>
              </ul>
            </div>
            <Button onClick={() => setCurrentStep("dni_front")} className="bg-primary text-primary-foreground">
              Comenzar Verificación
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentStep === "dni_front" && (
          <DocumentUploadStep
            title="Foto del Frente del DNI"
            description="Toma una foto clara del frente de tu documento de identidad. Asegúrate de que todos los datos sean legibles."
            documentType="dni_front"
            userId={user.id}
            onUploaded={handleDocumentUploaded}
            onBack={() => setCurrentStep("welcome")}
          />
        )}

        {currentStep === "dni_back" && (
          <DocumentUploadStep
            title="Foto del Reverso del DNI"
            description="Toma una foto clara del reverso de tu documento de identidad."
            documentType="dni_back"
            userId={user.id}
            onUploaded={handleDocumentUploaded}
            onBack={() => setCurrentStep("dni_front")}
          />
        )}



        {currentStep === "review" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Revisa tus Documentos</h2>
            <p className="text-muted-foreground mb-6">
              Verifica que todos los documentos sean legibles antes de enviar
            </p>

            <div className="space-y-4 mb-8">
              {uploadedDocuments.dni_front && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">DNI Frontal</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              )}
              {uploadedDocuments.dni_back && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">DNI Reverso</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              )}

            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep("dni_back")} className="flex-1 bg-transparent">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Volver
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-accent text-accent-foreground">
                Enviar Documentos
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "pending" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Documentos Enviados</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tus documentos están siendo revisados por nuestro equipo. Te notificaremos por email cuando tu cuenta sea
              verificada. Este proceso generalmente toma entre 24-48 horas.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-primary text-primary-foreground">
              Ir al Dashboard
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
