export interface RestaurantStats {
  // Orders
  ordersToday: number
  totalOrders: number
  pendingOrders: number
  completedOrdersToday: number
  
  // Revenue
  revenueToday: number
  
  // Tables
  totalTables: number
  activeTables: number
  availableTables: number
  
  // Sessions
  activeSessions: number
  
  // Credits
  freeCredits: number
  paidCredits: number
  totalCredits: number
  
  // Subscription
  subscriptionPlan: 'free' | 'basic' | 'pro' | 'enterprise'
  subscriptionStatus: 'active' | 'suspended' | 'cancelled'
  
  // Restaurant info
  restaurantName: string
  restaurantSlug: string
}

export interface DashboardData {
  stats: RestaurantStats
  recentOrders?: any[]
  topItems?: any[]
}