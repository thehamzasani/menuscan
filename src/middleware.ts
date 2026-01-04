import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    console.log('🔍 Middleware:', { path, role: token?.role, hasToken: !!token })

    // Allow super admin creation endpoint
    if (path === '/api/admin/create-super-admin') {
      return NextResponse.next()
    }

    // If no token, let withAuth handle it
    if (!token) {
      console.log('❌ No token found')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Super admin routes - only super_admin can access
    if (path.startsWith('/super-admin')) {
      if (token?.role !== 'super_admin') {
        console.log('❌ Unauthorized access to super-admin:', token?.role)
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Restaurant owner routes - only owner and staff can access
    if (path.startsWith('/dashboard')) {
      if (token?.role !== 'owner' && token?.role !== 'staff') {
        console.log('❌ Unauthorized access to dashboard:', token?.role)
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    console.log('✅ Access granted')
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access if token exists
        const hasToken = !!token
        console.log('🔐 Authorization check:', { hasToken, path: req.nextUrl.pathname })
        return hasToken
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/super-admin/:path*',
    '/api/admin/:path*',
    '/api/restaurants/:path*',
    '/api/menu/:path*',
    '/api/tables/:path*',
    '/api/orders/:path*',
  ],
}