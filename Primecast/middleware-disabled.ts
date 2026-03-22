import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  
  // IMMEDIATE BLOCKING: Block Netlify subdomain before any content loads
  if (hostname === 'primecast.netlify.app' || hostname.includes('netlify.app')) {
    console.log(`🚫 BLOCKED: Netlify subdomain access from ${hostname}`);
    
    // Return empty response immediately - no content shown at all
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Not Found</title>
        <meta name="robots" content="noindex, nofollow, nosnippet, noarchive">
        <meta http-equiv="refresh" content="0;url=https://primecastt.site">
      </head>
      <body style="margin:0;padding:0;background:#fff;font-family:system-ui;text-align:center;padding-top:30vh;">
        <h1 style="color:#666;">404</h1>
        <p style="color:#666;">Page not found</p>
        <script>window.location.replace('https://primecastt.site');</script>
      </body>
      </html>`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }

  // For all other domains (main domain), continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|robots.txt|sitemap|.*\\.(?:jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
