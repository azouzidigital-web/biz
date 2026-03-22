import { BlogPost } from '@/lib/blog'
import { TableOfContents } from './table-of-contents'
import { Button } from '@/components/ui/button'
import { Tv, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

interface BlogSidebarProps {
  post: BlogPost
}

export function BlogSidebar({ post }: BlogSidebarProps) {
  return (
    <aside className="space-y-5">
      {/* Veltrix Call-to-Action */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Tv className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Veltrix</h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
              ))}
              <span className="text-xs text-gray-600 ml-1">Rated 5/5</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Experience premium IPTV with 15,000+ channels, 4K streaming, and 99.9% uptime. 
        </p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/#pricing" className="flex items-center justify-center gap-2">
            Start now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Table of Contents */}
      <TableOfContents />
    </aside>
  )
}
