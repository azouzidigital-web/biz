import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'

export async function GET() {
  const posts = getAllPosts().slice(0, 20) // Latest 20 posts
  const baseUrl = 'https://primecastiptv.site'
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Veltrix IPTV Blog</title>
    <description>Latest IPTV guides, reviews, and troubleshooting tips from Veltrix experts</description>
    <link>${baseUrl}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/favicon-32x32.png</url>
      <title>Veltrix IPTV Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
    
    ${posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <category><![CDATA[${post.categories?.join(', ') || 'IPTV'}]]></category>
      <author><![CDATA[${post.author}]]></author>
      ${post.image ? `<enclosure url="${baseUrl}${post.image}" type="image/jpeg" />` : ''}
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
