'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="mt-2 text-slate-600">Track your restaurant's performance</p>
        </div>
        <Button disabled>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">PKR 0</div>
              <p className="text-sm text-slate-600">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Total Orders</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">PKR 0</div>
              <p className="text-sm text-slate-600">Avg. Order Value</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Top Items Sold</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center">
              <BarChart3 className="mx-auto h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">
                Daily, weekly, monthly revenue charts
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center">
              <TrendingUp className="mx-auto h-16 w-16 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">
                Most popular menu items
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <BarChart3 className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">Analytics Coming Soon</p>
            <p className="mt-2 text-sm text-slate-500">
              Complete analytics dashboard coming in Day 25
            </p>
            <div className="mt-6 flex gap-2 justify-center flex-wrap">
              <Badge className="bg-blue-100 text-blue-800">📊 Revenue Charts</Badge>
              <Badge className="bg-green-100 text-green-800">🏆 Top Items</Badge>
              <Badge className="bg-orange-100 text-orange-800">⏰ Peak Hours</Badge>
              <Badge className="bg-purple-100 text-purple-800">📈 Growth Trends</Badge>
              <Badge className="bg-pink-100 text-pink-800">🎯 Table Turnover</Badge>
            </div>
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-sm text-slate-700">
                <strong>Powered by Recharts:</strong> Beautiful, interactive charts for revenue, orders, peak hours, and more!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}