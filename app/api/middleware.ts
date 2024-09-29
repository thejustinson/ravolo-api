import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'API key is missing' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  if (apiKey !== process.env.API_KEY) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Invalid API key' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: '/api/ravolo/:path*',
}