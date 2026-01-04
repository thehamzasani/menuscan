'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users as UsersIcon } from 'lucide-react'

export default function UsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>
        <p className="mt-2 text-slate-600">Manage all restaurant owners and staff</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-slate-500">User management will be implemented in Day 5</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}