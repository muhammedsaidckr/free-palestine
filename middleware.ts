'use server'

import { NextResponse, type NextRequest } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClientFromRequest(request)

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Redirect to login page if not authenticated
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Check if user has admin role (you can customize this based on your user metadata)
    const userMetadata = user.user_metadata || {}
    const appMetadata = user.app_metadata || {}
    
    if (!userMetadata.role && !appMetadata.role) {
      // If no role is set, redirect to unauthorized page
      const url = request.nextUrl.clone()
      url.pathname = '/admin/unauthorized'
      return NextResponse.redirect(url)
    }

    const userRole = userMetadata.role || appMetadata.role
    if (userRole !== 'admin' && userRole !== 'editor') {
      // If user doesn't have admin/editor role, redirect to unauthorized page
      const url = request.nextUrl.clone()
      url.pathname = '/admin/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
