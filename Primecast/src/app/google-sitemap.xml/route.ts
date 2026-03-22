export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  // Ultra-simple sitemap that Google should definitely accept
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://primecastiptv.site/</loc><priority>1.0</priority></url>
<url><loc>https://primecastiptv.site/blog</loc><priority>0.9</priority></url>
<url><loc>https://primecastiptv.site/subscribe</loc><priority>0.9</priority></url>
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
