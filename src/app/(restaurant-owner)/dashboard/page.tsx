'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600">Welcome back, {session?.user.name}!</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-slate-600">Name</p>
              <p className="font-medium">{session?.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-medium">{session?.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Role</p>
              <p className="font-medium capitalize">{session?.user.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Dashboard stats will appear here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Activity feed will appear here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}