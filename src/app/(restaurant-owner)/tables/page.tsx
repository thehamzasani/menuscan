'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Plus } from 'lucide-react'

export default function TablesPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tables & QR Codes</h1>
          <p className="mt-2 text-slate-600">Manage your restaurant tables and generate QR codes</p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Total Tables</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <QrCode className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Available</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <QrCode className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Occupied</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Your Tables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <QrCode className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">No tables yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Table management and QR code generation coming in Days 11-12
            </p>
            <Button disabled className="mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Table
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}