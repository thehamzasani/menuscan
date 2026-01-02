import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Super admin routes
    if (path.startsWith('/super-admin')) {
      if (token?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Restaurant owner routes
    if (path.startsWith('/dashboard')) {
      if (token?.role !== 'owner' && token?.role !== 'staff') {
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
    '/api/restaurants/:path*',
    '/api/menu/:path*',
    '/api/tables/:path*',
    '/api/orders/:path*',
  ],
}