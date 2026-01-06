'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, Database, Server, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-600">System configuration and information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Version</span>
              <Badge>v1.0.0</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Environment</span>
              <Badge className="bg-green-100 text-green-800">Production</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Provider</span>
              <span className="font-medium">MongoDB Atlas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status</span>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Authentication</span>
              <Badge className="bg-green-100 text-green-800">NextAuth.js</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">SSL/TLS</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Platform Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Framework</span>
              <span className="font-medium">Next.js 15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Language</span>
              <span className="font-medium">TypeScript</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-slate-500">
            <p className="text-sm">Email configuration, payment settings, and more coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}