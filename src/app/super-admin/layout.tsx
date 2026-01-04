'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
  { name: 'Restaurants', href: '/super-admin/restaurants', icon: Store },
  { name: 'Credits', href: '/super-admin/credits', icon: CreditCard },
  { name: 'Users', href: '/super-admin/users', icon: Users },
  { name: 'Settings', href: '/super-admin/settings', icon: Settings },
]

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user.role !== 'super_admin') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-slate-800">
          <h1 className="text-xl font-bold">
            Menu<span className="text-blue-400">Scan</span>
          </h1>
          <span className="ml-2 rounded bg-blue-600 px-2 py-0.5 text-xs">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info & Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
          <div className="mb-3 text-sm">
            <p className="font-medium">{session?.user.name}</p>
            <p className="text-xs text-slate-400">{session?.user.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}