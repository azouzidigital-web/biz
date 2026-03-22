import { getPostBySlug, getAllPosts, getRelatedPosts, generateBlogSchema } from '@/lib/blog'
import { BlogContent } from '@/components/blog/blog-content'
import { BlogHeader } from '@/components/blog/blog-header'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { RelatedPosts } from '@/components/blog/related-posts'
import { Navbar } from '@/components/landing/navbar'
import { Footer } from '@/components/landing/footer'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Veltrix Blog',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | Veltrix Blog`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      type: 'article',
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate,
      authors: [post.author],
      section: post.categories?.[0] || 'IPTV',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: `https://primecastiptv.site/blog/${slug}`,
    },
    other: {
      'article:published_time': post.publishDate,
      'article:modified_time': post.updatedDate || post.publishDate,
      'article:author': post.author,
      'article:section': post.categories?.[0] || 'IPTV',
      'article:tag': post.keywords.join(', '),
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post)
  const schema = generateBlogSchema(post)

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <ReadingProgress />
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-16">
          <article>
            <BlogHeader post={post} />
            <BlogContent post={post} />
          </article>
          
          {relatedPosts.length > 0 && (
            <RelatedPosts posts={relatedPosts} />
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}
