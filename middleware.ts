'use server'

import { NextResponse, type NextRequest } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClientFromRequest(request)

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser()

  // Protect admin routes (except login and unauthorized pages)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login') && 
      !request.nextUrl.pathname.startsWith('/admin/unauthorized')) {
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
    
    const userRole = userMetadata.role || appMetadata.role
    
    // Only redirect to unauthorized if user explicitly has a role that's not admin/editor
    // If no role is set, allow access (they can be granted admin role later)
    if (userRole && userRole !== 'admin' && userRole !== 'editor') {
      // If user has a role but it's not admin/editor, redirect to unauthorized page
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
