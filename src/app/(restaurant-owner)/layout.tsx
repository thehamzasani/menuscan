'use client'

import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Utensils,
  QrCode,
  ShoppingCart,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  CreditCard
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Menu', href: '/menu', icon: Utensils },
  { name: 'Tables & QR', href: '/tables', icon: QrCode },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Chats', href: '/chats', icon: MessageSquare },
  { name: 'Waiter Calls', href: '/calls', icon: Bell },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function OwnerLayout({ children }: { children: ReactNode }) {
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

  if (status === 'unauthenticated') {
    redirect('/login')
  }

  if (session?.user.role !== 'owner' && session?.user.role !== 'staff') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-slate-200">
          <h1 className="text-xl font-bold">
            <span className="text-slate-900">Menu</span>
            <span className="text-blue-600">Scan</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', isActive ? 'text-blue-600' : 'text-slate-500')} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info & Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
          <div className="mb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {session?.user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{session?.user.name}</p>
                <p className="text-xs text-slate-500 truncate">{session?.user.email}</p>
              </div>
            </div>
            <Link href="/billing">
              <div className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-xs text-slate-600">Credits</p>
                  <p className="text-sm font-bold text-blue-600">View Balance</p>
                </div>
              </div>
            </Link>
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
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {children}
        </div>
      </div>
    </div>
  )
}