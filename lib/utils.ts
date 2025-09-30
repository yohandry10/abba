//utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format exchange rates properly - ALWAYS show the full number
export function formatExchangeRate(rate: number | string): string {
  // Handle edge cases
  if (!rate || rate === 0) return "0"
  
  // Convert to number if it's a string
  const numRate = typeof rate === 'string' ? parseFloat(rate) : rate
  
  if (isNaN(numRate)) return "0"
  
  // Use scientific notation check to handle very small numbers
  const rateStr = numRate.toString()
  
  // If the number is in scientific notation or very small, use more decimals
  if (rateStr.includes('e-') || numRate < 0.000001) {
    return numRate.toFixed(15).replace(/\.?0+$/, '') || numRate.toString()
  } else if (numRate < 0.00001) {
    return numRate.toFixed(12)
  } else if (numRate < 0.0001) {
    return numRate.toFixed(10)
  } else if (numRate < 0.001) {
    return numRate.toFixed(8)
  } else if (numRate < 0.01) {
    return numRate.toFixed(6)
  } else if (numRate < 1) {
    return numRate.toFixed(6)
  } else {
    return numRate.toFixed(4)
  }
}
