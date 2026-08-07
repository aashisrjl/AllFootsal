import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Nepal mobile: exactly 10 digits starting with 98 or 97 */
export const NEPAL_PHONE_REGEX = /^(98|97)\d{8}$/

export function isValidNepalPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return NEPAL_PHONE_REGEX.test(digits)
}

export function getNepalPhoneError(phone: string): string | null {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return "Phone number is required"
  if (!/^\d+$/.test(digits)) return "Phone number must contain digits only"
  if (digits.length !== 10) return "Phone number must be exactly 10 digits"
  if (!/^(98|97)/.test(digits)) return "Phone number must start with 98 or 97"
  return null
}

export function looksLikePhoneInput(value: string): boolean {
  const trimmed = value.trim()
  return /^\d+$/.test(trimmed)
}
