import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  // Nếu đã đăng nhập và truy cập trang auth, chuyển về trang chủ
  if (req.auth && req.nextUrl.pathname.startsWith('/auth')) {
    const newUrl = new URL('/', req.nextUrl.origin)
    return NextResponse.redirect(newUrl)
  }

  // Nếu chưa đăng nhập và truy cập trang admin, chuyển về trang đăng nhập
  if (!req.auth && req.nextUrl.pathname.startsWith('/admin')) {
    const loginUrl = new URL('/auth/signin', req.nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  // For all other cases, the default `auth` middleware behavior will apply,
  // protecting routes and redirecting unauthenticated users as needed.
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
