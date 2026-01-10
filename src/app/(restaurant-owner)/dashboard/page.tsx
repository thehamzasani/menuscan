// 'use client'

// import { useSession, signOut } from 'next-auth/react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// export default function DashboardPage() {
//   const { data: session } = useSession()

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Dashboard</h1>
//           <p className="text-slate-600">Welcome back, {session?.user.name}!</p>
//         </div>
//         <Button 
//           variant="outline" 
//           onClick={() => signOut({ callbackUrl: '/login' })}
//         >
//           Sign Out
//         </Button>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle>User Info</CardTitle>
//             <CardDescription>Your account details</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div>
//               <p className="text-sm text-slate-600">Name</p>
//               <p className="font-medium">{session?.user.name}</p>
//             </div>
//             <div>
//               <p className="text-sm text-slate-600">Email</p>
//               <p className="font-medium">{session?.user.email}</p>
//             </div>
//             <div>
//               <p className="text-sm text-slate-600">Role</p>
//               <p className="font-medium capitalize">{session?.user.role}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Stats</CardTitle>
//             <CardDescription>Coming soon</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-slate-600">Dashboard stats will appear here</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//             <CardDescription>Coming soon</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-slate-600">Activity feed will appear here</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StatsCard from '@/components/owner/StatsCard'
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  CheckCircle,
  Plus,
  QrCode,
  Utensils,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { RestaurantStats } from '@/types/stats'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<RestaurantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/restaurants/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Failed to load stats')
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>
    }
    if (status === 'suspended') {
      return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
    }
    return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
  }

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-slate-100 text-slate-800',
      basic: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800',
    }
    return (
      <Badge className={colors[plan] || colors.free}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
      </Badge>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Welcome back, {session?.user.name}! 👋
            </p>
          </div>
          <div className="flex items-center gap-2">
            {stats && getStatusBadge(stats.subscriptionStatus)}
            {stats && getPlanBadge(stats.subscriptionPlan)}
          </div>
        </div>
      </div>

      {/* Credits Banner */}
      {stats && (
        <Card className="mb-6 bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Available Credits</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-slate-900">{stats.totalCredits}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="text-green-600">
                      {stats.freeCredits} free
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-blue-600">
                      {stats.paidCredits} purchased
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/billing">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buy Credits
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Orders Today"
            value={stats.ordersToday}
            icon={ShoppingCart}
            description={`${stats.completedOrdersToday} completed`}
            color="blue"
          />
          <StatsCard
            title="Revenue Today"
            value={formatPrice(stats.revenueToday)}
            icon={DollarSign}
            description="Total earnings today"
            color="green"
          />
          <StatsCard
            title="Active Tables"
            value={`${stats.activeTables}/${stats.totalTables}`}
            icon={Users}
            description={`${stats.availableTables} available`}
            color="orange"
          />
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={CheckCircle}
            description="Needs your attention"
            color="purple"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/menu/items/new" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-blue-200">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Add Menu Item</h3>
                  <p className="text-sm text-slate-600">Create a new dish</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tables" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-green-200">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Generate QR Codes</h3>
                  <p className="text-sm text-slate-600">For your tables</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/orders" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-orange-200">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Orders</h3>
                  <p className="text-sm text-slate-600">Manage all orders</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Restaurant Info */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Restaurant Name</p>
                <p className="font-medium">{stats.restaurantName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Public URL</p>
                <p className="font-medium text-blue-600">/{stats.restaurantSlug}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="font-medium">{stats.totalOrders}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Orders Placed</span>
                <span className="font-medium">{stats.ordersToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Orders Completed</span>
                <span className="font-medium text-green-600">{stats.completedOrdersToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Pending Orders</span>
                <span className="font-medium text-orange-600">{stats.pendingOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Active Sessions</span>
                <span className="font-medium">{stats.activeSessions}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">Total Revenue</span>
                  <span className="font-bold text-green-600">{formatPrice(stats.revenueToday)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}