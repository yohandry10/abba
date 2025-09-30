"use client"

import React from "react"
import clsx from "clsx"

type Props = {
  rate: number | string
  currency?: string
  className?: string
  /** Máximo de dígitos totales después del punto que permites mostrar */
  maxDigits?: number
  /** Forzar un mínimo de decimales (si quieres) */
  minFractionDigits?: number
}

/**
 * Muestra tasas sin truncar a entero cuando son menores a 1.
 * Reglas:
 *  - >= 1: 2–4 decimales
 *  - 0.1–1: 4–6 decimales
 *  - < 0.1: 6–8 decimales (según maxDigits)
 */
export function SmartRateDisplay({
  rate,
  currency = "",
  className,
  maxDigits = 8,
  minFractionDigits,
}: Props) {
  const n = typeof rate === "string" ? Number(rate) : rate
  if (!Number.isFinite(n)) {
    return (
      <span className={clsx("font-heading font-extrabold", className)}>
        -.---- {currency}
      </span>
    )
  }

  const abs = Math.abs(n)
  let minFrac = minFractionDigits ?? 2
  let maxFrac = 4

  if (abs < 1 && abs >= 0.1) {
    minFrac = Math.max(minFrac, 4)
    maxFrac = Math.min(Math.max(6, minFrac), maxDigits)
  } else if (abs < 0.1) {
    minFrac = Math.max(minFrac, 6)
    maxFrac = Math.min(Math.max(8, minFrac), maxDigits)
  } else {
    // abs >= 1
    minFrac = Math.max(minFrac, 2)
    maxFrac = Math.max(4, minFrac)
  }

  const formatted = n.toLocaleString("es-PE", {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  })

  return (
    <span className={clsx("font-heading font-extrabold", className)}>
      {formatted}
      {currency ? ` ${currency}` : ""}
    </span>
  )
}

export default SmartRateDisplay
