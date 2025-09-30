"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, ArrowLeft, CheckCircle2, X } from "lucide-react"
import Image from "next/image"

interface DocumentUploadStepProps {
  title: string
  description: string
  documentType: string
  userId: string
  onUploaded: (documentType: string, url: string) => void
  onBack: () => void
}

export function DocumentUploadStep({
  title,
  description,
  documentType,
  userId,
  onUploaded,
  onBack,
}: DocumentUploadStepProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB")
      return
    }

    setError("")
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append("file", file)
      formData.append("documentType", documentType)
      formData.append("userId", userId)

      const response = await fetch("/api/upload/kyc", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir el archivo")
      }

      const data = await response.json()
      setUploading(false)

      // Wait a moment to show the preview
      setTimeout(() => {
        onUploaded(documentType, data.url)
      }, 1000)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError("Error al subir el archivo. Por favor intenta de nuevo.")
      setUploading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-foreground">{title}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6">
        {preview ? (
          <div className="relative">
            <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            </div>
            {uploading ? (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Subiendo documento...</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center rounded-lg">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            )}
            <button
              onClick={() => {
                setPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">Haz clic para subir una imagen</p>
            <p className="text-xs text-muted-foreground">PNG, JPG o JPEG (máx. 5MB)</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} disabled={uploading} className="bg-transparent">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Volver
        </Button>
      </div>
    </div>
  )
}
