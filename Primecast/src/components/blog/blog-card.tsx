import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BlogPost } from '@/lib/blog'
import { Calendar, Clock, User } from 'lucide-react'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${
      featured ? 'border-primary/20 shadow-lg' : ''
    }`}>
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {featured && (
          <div className="absolute top-4 left-4">
            <Badge variant="destructive" className="bg-primary">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {post.categories?.[0] || 'IPTV'}
          </Badge>
        </div>
        
        <h3 className={`font-semibold line-clamp-2 leading-tight ${
          featured ? 'text-xl' : 'text-lg'
        }`}>
          <Link 
            href={`/blog/${post.slug}`} 
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
          {post.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {post.author}
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            Read More →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
