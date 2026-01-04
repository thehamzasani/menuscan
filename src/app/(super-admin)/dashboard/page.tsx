'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Users, ShoppingCart, TrendingUp, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalRestaurants: number
  activeRestaurants: number
  suspendedRestaurants: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  recentRestaurants: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Failed to load stats')
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setError('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        {error}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Restaurants',
      value: stats?.totalRestaurants || 0,
      icon: Store,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'All registered restaurants',
    },
    {
      title: 'Active Restaurants',
      value: stats?.activeRestaurants || 0,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Currently active',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Restaurant owners',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'All time orders',
    },
    {
      title: 'Total Revenue',
      value: `${stats?.totalRevenue || 0} Credits`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      description: 'From credit purchases',
    },
    {
      title: 'New This Week',
      value: stats?.recentRestaurants || 0,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      description: 'Last 7 days',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome to MenuScan Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/super-admin/restaurants"
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 hover:border-blue-300"
              >
                <Store className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Manage Restaurants</h3>
                  <p className="text-sm text-slate-600">View and manage all restaurants</p>
                </div>
              </Link>

              <Link
                href="/super-admin/credits"
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 hover:border-green-300"
              >
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">Grant Credits</h3>
                  <p className="text-sm text-slate-600">Manage restaurant credits</p>
                </div>
              </Link>

              <Link
                href="/super-admin/users"
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 hover:border-purple-300"
              >
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Manage Users</h3>
                  <p className="text-sm text-slate-600">View all restaurant owners</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Rate</span>
                <span className="font-semibold">
                  {stats?.totalRestaurants 
                    ? Math.round((stats.activeRestaurants / stats.totalRestaurants) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Suspended</span>
                <span className="font-semibold text-red-600">
                  {stats?.suspendedRestaurants || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">New This Week</span>
                <span className="font-semibold text-green-600">
                  +{stats?.recentRestaurants || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Orders</span>
                <span className="font-semibold">
                  {stats?.totalOrders || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}