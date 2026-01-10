'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Store, Palette, Clock, Bell, User } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">Configure your restaurant settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Restaurant Info</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Name, address, contact details
                </p>
                <Badge className="bg-slate-100 text-slate-800">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Branding</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Logo, colors, theme
                </p>
                <Badge className="bg-slate-100 text-slate-800">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Operating Hours</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Opening and closing times
                </p>
                <Badge className="bg-slate-100 text-slate-800">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Notifications</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Email, SMS preferences
                </p>
                <Badge className="bg-slate-100 text-slate-800">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Staff Management</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Add and manage staff
                </p>
                <Badge className="bg-slate-100 text-slate-800">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Advanced</h3>
                <p className="text-sm text-slate-600 mb-3">
                  API, integrations, webhooks
                </p>
                <Badge className="bg-slate-100 text-slate-800">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Settings className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">Settings Coming Soon</p>
            <p className="mt-2 text-sm text-slate-500">
              Complete settings configuration in future updates
            </p>
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> You configured your basic settings during restaurant creation. Advanced settings will be available in future updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}