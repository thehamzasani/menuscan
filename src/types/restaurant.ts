import { IRestaurant } from '@/models/Restaurant'

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'active' | 'suspended' | 'cancelled'

export interface RestaurantSettings {
  currency: string
  language: 'en' | 'ur'
  theme: {
    primaryColor: string
    secondaryColor: string
  }
  openingHours: Array<{
    day: string
    open: string
    close: string
    closed: boolean
  }>
}

export interface RestaurantAddress {
  street: string
  city: string
  area: string
  phone: string
}

export interface RestaurantSubscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  freeCredits: number
  paidCredits: number
  startDate?: Date
  endDate?: Date
  autoRenew: boolean
}

export interface Restaurant {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string
  logo?: string
  coverImage?: string
  address: RestaurantAddress
  settings: RestaurantSettings
  subscription: RestaurantSubscription
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Form step data types
export interface OwnerDetailsStep {
  name: string
  email: string
  password: string
}

export interface RestaurantDetailsStep {
  restaurantName: string
  description?: string
  street: string
  area: string
  city: string
  phone: string
}

export interface SettingsStep {
  currency: string
  language: 'en' | 'ur'
  primaryColor: string
  secondaryColor: string
}

// Combined registration data
export interface RegistrationData {
  owner: OwnerDetailsStep
  restaurant: RestaurantDetailsStep
  settings: SettingsStep
}