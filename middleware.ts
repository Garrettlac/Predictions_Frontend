import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware is disabled - relying on client-side auth checks instead
// since Supabase uses localStorage which isn't accessible in middleware
export async function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/picks', '/account', '/get-started']
}
