import { Types } from 'mongoose'

// User types
export type UserRole = 'owner' | 'staff' | 'super_admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  restaurantId?: string
  phone?: string
  image?: string
  createdAt: Date
}

// Restaurant types
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled'

// Table types
export type TableStatus = 'available' | 'occupied' | 'reserved'

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled'

// Message types
export type SenderType = 'customer' | 'owner' | 'staff'

// Waiter call types
export type CallReason = 'service' | 'bill' | 'help' | 'water' | 'other'
export type CallStatus = 'pending' | 'acknowledged' | 'completed' | 'cancelled'

// Credit transaction types
export type CreditTransactionType = 'purchase' | 'admin_grant' | 'usage' | 'refund'

// API Response type
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}