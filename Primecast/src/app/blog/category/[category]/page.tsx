import { getPostsByCategory, getAllCategories } from '@/lib/blog'
import { BlogCard } from '@/components/blog/blog-card'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryName = category.replace(/-/g, ' ')
  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
  
  return {
    title: `${formattedCategory} - IPTV ${formattedCategory} | PrimeCast Blog`,
    description: `Expert IPTV ${categoryName} articles and guides from PrimeCast. Learn everything about ${categoryName} for streaming.`,
    openGraph: {
      title: `IPTV ${formattedCategory} | PrimeCast Blog`,
      description: `Expert IPTV ${categoryName} articles and guides from PrimeCast.`,
      type: 'website',
    },
    alternates: {
      canonical: `https://primecastiptv.site/blog/category/${category}`,
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryName = category.replace(/-/g, ' ')
  const posts = getPostsByCategory(categoryName)
  
  if (posts.length === 0) {
    notFound()
  }

  const formattedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/blog"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </nav>

          {/* Category Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              IPTV {formattedCategory}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert guides and tips for {categoryName.toLowerCase()} in IPTV streaming
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
