import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Super admin routes - only super_admin can access
    if (path.startsWith('/super-admin')) {
      if (token?.role !== 'super_admin') {
        console.log('Unauthorized access attempt to super-admin:', token?.role)
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Restaurant owner routes - only owner and staff can access
    if (path.startsWith('/dashboard')) {
      if (token?.role !== 'owner' && token?.role !== 'staff') {
        console.log('Unauthorized access attempt to dashboard:', token?.role)
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/super-admin/:path*',
    '/api/admin/:path*',
    '/api/restaurants/manage/:path*',
    '/api/restaurants/stats',
    '/api/menu/:path*',  // ✅ This protects all menu routes including categories
    '/api/tables/:path*',
    '/api/orders/:path*',
    '/api/chat/:path*',
  ],
}