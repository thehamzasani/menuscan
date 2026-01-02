'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-[5rem]">
          Menu<span className="text-blue-600">Scan</span>
        </h1>
        
        <p className="text-center text-xl text-slate-600 max-w-2xl">
          Digital menu and ordering system for restaurants in Pakistan. 
          Scan QR codes, order instantly, and streamline your restaurant operations.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started - Free
                </Button>
              </Link>
              
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8 w-full max-w-4xl mt-8">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-4xl">📱</div>
            <h3 className="text-lg font-semibold">QR Code Ordering</h3>
            <p className="text-center text-sm text-slate-600">
              Customers scan and order from their phones
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-4xl">💬</div>
            <h3 className="text-lg font-semibold">Real-time Chat</h3>
            <p className="text-center text-sm text-slate-600">
              Direct communication with customers
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-4xl">🔔</div>
            <h3 className="text-lg font-semibold">Waiter Call</h3>
            <p className="text-center text-sm text-slate-600">
              Instant notifications for table service
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}