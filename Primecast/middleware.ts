import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware disabled - blocking handled at Netlify server level via _redirects
  // This avoids any client-side content flashing issues
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|robots.txt|sitemap|.*\\.(?:jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
