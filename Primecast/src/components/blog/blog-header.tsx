import Image from 'next/image'
import { BlogPost } from '@/lib/blog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Calendar, Clock, User, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BlogHeaderProps {
  post: BlogPost
}

export function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <header className="relative overflow-hidden">
      {/* Hero Image with Parallax Effect */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transform scale-105 hover:scale-100 transition-transform duration-700 blur-2xl"
          priority
          sizes="100vw"
        />
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Link 
                href="/blog"
                className="inline-flex items-center text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </nav>

            <div className="grid lg:grid-cols-3 gap-8 items-end">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Category Badge */}
                <Badge className="mb-6 bg-primary/90 text-white px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                  {post.categories?.[0] || 'IPTV'}
                </Badge>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  {post.title}
                </h1>
                
                {/* Description */}
                <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
                  {post.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-2 rounded-full">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-2 rounded-full">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-2 rounded-full">
                    <Clock className="h-4 w-4" />
                    {post.readTime || '5 min read'}
                  </div>
                  <div className="flex items-center gap-2 backdrop-blur-sm bg-white/10 px-3 py-2 rounded-full">
                    <Eye className="h-4 w-4" />
                    <span>2.5k views</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="lg:col-span-1">
                <Card className="backdrop-blur-sm bg-white/10 border-white/20 p-6 text-white">
                  <h3 className="font-semibold mb-4 text-white">Article Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Reading time</span>
                      <span className="font-medium">{post.readTime || '5 min'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Published</span>
                      <span className="font-medium">
                        {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Category</span>
                      <span className="font-medium">{post.categories?.[0] || 'IPTV'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Tags</span>
                      <span className="font-medium">{post.keywords.length}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div className="h-full bg-primary w-0 transition-all duration-300" id="reading-progress"></div>
      </div>
    </header>
  )
}
