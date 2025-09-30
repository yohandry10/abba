//type/database.ts
export type UserRole = "admin" | "client"
export type UserStatus = "pending_kyc" | "active" | "suspended"
export type OrderStatus = "pending" | "payment_uploaded" | "confirmed" | "completed" | "cancelled"
export type OrderType = "soles_to_bolivares" | "bolivares_to_soles"

export interface User {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  full_name: string | null
  phone: string | null
  country: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface KYCDocument {
  id: string
  user_id: string
  document_type: "dni_front" | "dni_back" | "selfie"
  file_url: string
  uploaded_at: string
  verified: boolean
  verified_at: string | null
  verified_by: string | null
}

export interface ExchangeRate {
  id: string
  soles_to_bolivares: number
  bolivares_to_soles: number
  published_by: string
  published_at: string
  is_active: boolean
}

export interface Order {
  id: string
  order_number: string
  client_id: string
  order_type: OrderType
  amount_send: number
  amount_receive: number
  exchange_rate: number
  status: OrderStatus
  sender_name: string
  sender_bank: string
  sender_account: string
  receiver_name: string
  receiver_bank: string
  receiver_account: string
  receiver_document: string
  payment_proof_url: string | null
  payment_uploaded_at: string | null
  confirmed_by: string | null
  confirmed_at: string | null
  completed_at: string | null
  client_notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface SystemSetting {
  id: string
  key: string
  value: string
  description: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  table_name: string | null
  record_id: string | null
  old_values: any
  new_values: any
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  ip_address: string | null
  user_agent: string | null
  expires_at: string
  created_at: string
}

export interface Bank {
  id: string
  name: string
  country: "PE" | "VE"
  code: string | null
  is_active: boolean
  created_at: string
}
