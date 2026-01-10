'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Utensils } from 'lucide-react'

export default function MenuPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Menu Management</h1>
        <p className="mt-2 text-slate-600">Create and manage your restaurant menu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Menu Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <Utensils className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-slate-500">Menu management coming in Day 8-10</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}