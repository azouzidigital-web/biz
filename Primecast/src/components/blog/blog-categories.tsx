import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BlogCategoriesProps {
  categories: string[]
}

export function BlogCategories({ categories }: BlogCategoriesProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground">
            Find exactly what you're looking for with our organized categories
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            if (!category || typeof category !== 'string') return null
            const slug = category.toLowerCase().replace(/\s+/g, '-')
            return (
              <Button
                key={category}
                variant="outline"
                asChild
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Link href={`/blog/category/${slug}`}>
                  {category}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
