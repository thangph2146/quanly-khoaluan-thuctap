import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/access-denied',
  ]
  
  // Check if current path is public or auth related
  const isPublicPath = publicPaths.some(path => req.nextUrl.pathname === path) ||
                      req.nextUrl.pathname.startsWith('/auth/')

  // If not authenticated and trying to access protected route, redirect to signin
  if (!req.auth && !isPublicPath) {
    const loginUrl = new URL('/api/auth/signin', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  // Enable middleware for all paths except API, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
