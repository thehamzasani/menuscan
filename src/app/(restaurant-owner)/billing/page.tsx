'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, TrendingUp, DollarSign, Calendar, Plus, Download } from 'lucide-react'
import { RestaurantStats } from '@/types/stats'

export default function BillingPage() {
  const [stats, setStats] = useState<RestaurantStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/restaurants/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      name: 'Basic',
      price: 2000,
      credits: 500,
      features: ['500 Credits', 'Basic Support', 'Email Notifications'],
      color: 'blue',
    },
    {
      name: 'Pro',
      price: 5000,
      credits: 1500,
      features: ['1500 Credits', 'Priority Support', 'SMS Notifications', 'Advanced Analytics'],
      color: 'purple',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 10000,
      credits: 3500,
      features: ['3500 Credits', '24/7 Support', 'Custom Branding', 'API Access', 'Multiple Locations'],
      color: 'orange',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Billing & Credits</h1>
        <p className="mt-2 text-slate-600">Manage your subscription and purchase credits</p>
      </div>

      {/* Current Balance */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Your Current Balance</p>
                {loading ? (
                  <div className="h-8 w-32 bg-slate-200 animate-pulse rounded"></div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-slate-900">
                      {stats?.totalCredits || 0} Credits
                    </p>
                    <div className="flex gap-3 mt-2 text-sm">
                      <span className="text-green-600 font-medium">
                        {stats?.freeCredits || 0} free
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-blue-600 font-medium">
                        {stats?.paidCredits || 0} purchased
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <Badge className="mb-2 bg-green-100 text-green-800">
                {stats?.subscriptionPlan?.toUpperCase() || 'FREE'} PLAN
              </Badge>
              <p className="text-xs text-slate-600">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packages */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Purchase Credits</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative hover:shadow-lg transition-all ${
                plan.popular ? 'border-2 border-purple-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-2xl font-bold">{plan.name}</div>
                  <div className="mt-2 text-3xl font-bold text-blue-600">
                    PKR {plan.price.toLocaleString()}
                  </div>
                  <div className="mt-1 text-sm text-slate-600 font-normal">
                    {plan.credits} Credits
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Buy {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            <strong>Payment Integration Coming in Day 23-24:</strong> JazzCash payment gateway will be integrated soon. For now, contact support to purchase credits.
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Calendar className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">No transactions yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Your credit purchase and usage history will appear here
            </p>
            <div className="mt-6 flex gap-2 justify-center">
              <Badge className="bg-blue-100 text-blue-800">Purchase History</Badge>
              <Badge className="bg-green-100 text-green-800">Usage Tracking</Badge>
              <Badge className="bg-purple-100 text-purple-800">PDF Invoices</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Usage Stats */}
      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Credits Used</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Spent</p>
                <p className="text-2xl font-bold">PKR 0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">This Month</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}