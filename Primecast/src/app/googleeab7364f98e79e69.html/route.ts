export const dynamic = 'force-static'

export async function GET() {
  return new Response('google-site-verification: googleeab7364f98e79e69.html', {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
