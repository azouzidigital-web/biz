import { getAllPosts } from '@/lib/blog'
import { BlogCard } from '@/components/blog/blog-card'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IPTV Blog - Guides, Reviews & Tips | PrimeCast',
  description: 'Expert IPTV guides, device reviews, and streaming tips. Learn how to set up IPTV, fix buffering issues, and choose the best streaming devices.',
  keywords: [
    'IPTV blog',
    'streaming guides',
    'IPTV setup',
    'streaming device reviews',
    'IPTV troubleshooting',
    'cord cutting guide'
  ],
  openGraph: {
    title: 'IPTV Blog - Expert Guides & Reviews | PrimeCast',
    description: 'Complete IPTV guides, device reviews, and streaming tips from Veltrix experts.',
    type: 'website',
    url: 'https://primecastiptv.site/blog',
  },
  alternates: {
    canonical: 'https://primecastiptv.site/blog',
  }
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const recentPosts = allPosts.slice(0, 9)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Latest IPTV Articles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest IPTV guides, reviews, and tips to enhance your streaming experience.
            </p>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            {recentPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-3">No posts yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for expert IPTV guides and tips!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
