'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="mt-2 text-slate-600">Manage and track all your orders</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Preparing</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">No orders yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Order management system coming in Days 16-17
            </p>
            <div className="mt-6 flex gap-2 justify-center">
              <Badge className="bg-orange-100 text-orange-800">Real-time Updates</Badge>
              <Badge className="bg-blue-100 text-blue-800">Kitchen Display</Badge>
              <Badge className="bg-green-100 text-green-800">Order Tracking</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}