import { NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/bookings', '/wallet', '/profile', '/grounds/book']

export function proxy(request) {
  const { pathname } = request.nextUrl
  const isProtected  = PROTECTED.some(p => pathname.startsWith(p))

  if (isProtected) {
    const token = request.cookies.get('syg_token')?.value
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
