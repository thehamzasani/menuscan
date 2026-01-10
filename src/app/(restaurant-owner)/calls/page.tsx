'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function WaiterCallsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Waiter Calls</h1>
        <p className="mt-2 text-slate-600">Manage customer service requests</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Acknowledged</p>
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Total Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Bell className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">No waiter calls yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Waiter call feature coming in Day 22
            </p>
            <div className="mt-6 flex gap-2 justify-center flex-wrap">
              <Badge className="bg-red-100 text-red-800">🔔 Audio Alerts</Badge>
              <Badge className="bg-blue-100 text-blue-800">📱 Real-time Notifications</Badge>
              <Badge className="bg-green-100 text-green-800">✅ Quick Acknowledge</Badge>
              <Badge className="bg-purple-100 text-purple-800">📊 Call Analytics</Badge>
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-900">
                <strong>Coming Soon:</strong> Customers will have a floating bell button to call for service, bill, water, or help!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}