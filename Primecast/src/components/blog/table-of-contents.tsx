'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { List, ChevronRight, Zap, ChevronDown, ChevronUp } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  useEffect(() => {
    // Generate table of contents from H1 and H2 headings only
    const headings = document.querySelectorAll('h1, h2')
    const tocItems: TocItem[] = []
    const seenH1Ids = new Set<string>()

    // Define important keywords that should be prioritized in TOC
    const importantKeywords = [
      'introduction', 'overview', 'comparison', 'providers', 'plans', 'pricing', 
      'features', 'setup', 'installation', 'legal', 'conclusion', 'choosing', 
      'tier 1', 'tier 2', 'tier 3', 'premium', 'standard', 'budget', 'sports',
      'regional', 'technical', 'cost', 'future', 'recommendations'
    ]

    headings.forEach((heading) => {
      if (heading.id) {
        const level = parseInt(heading.tagName.charAt(1))
        const text = heading.textContent || ''
        const textLower = text.toLowerCase()
        
        // For H1 headings, only include if we haven't seen this ID before
        if (level === 1) {
          if (!seenH1Ids.has(heading.id)) {
            seenH1Ids.add(heading.id)
            tocItems.push({
              id: heading.id,
              text: text,
              level: level
            })
          }
        } else if (level === 2) {
          // For H2 headings, only include important ones to keep TOC concise
          const isImportant = importantKeywords.some(keyword => 
            textLower.includes(keyword)
          )
          
          if (isImportant || tocItems.filter(item => item.level === 2).length < 6) {
            tocItems.push({
              id: heading.id,
              text: text,
              level: level
            })
          }
        }
      }
    })

    // Limit total TOC items to 8 for better UX
    const limitedTocItems = tocItems.slice(0, 8)
    setToc(limitedTocItems)

    // Set up intersection observer for active section - only tracked headings
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only set active if this heading is in our filtered TOC
            const isInToc = limitedTocItems.some(item => item.id === entry.target.id)
            if (isInToc) {
              setActiveId(entry.target.id)
            }
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0.1
      }
    )

    // Only observe headings that are in our filtered TOC
    limitedTocItems.forEach((tocItem) => {
      const element = document.getElementById(tocItem.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (toc.length === 0) return null

  return (
    <Card className={`sticky top-20 border border-border/50 bg-card/95 backdrop-blur-sm shadow-sm transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-5'} ${className}`}>
      {/* Header with Collapse Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-primary/10">
            <List className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium text-foreground text-sm">Contents</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="h-7 w-7 p-0 hover:bg-muted/50 transition-colors"
          aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[1000px] opacity-100'}`}>
        {/* CTA Section - Moved to Top */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/8 border border-primary/20">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
              <Zap className="h-4 w-4 text-primary" />
              <span>Ready to start streaming?</span>
            </div>
            <Button 
              asChild
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <a href="/#yearly-plan" className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" />
                View Pricing Plans
              </a>
            </Button>
            <p className="text-xs text-muted-foreground/70">
              Join 10,000+ satisfied customers
            </p>
          </div>
        </div>

        {/* IPTV Provider Comparison - Quick Access */}
        <div className="mb-5 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-primary/10">
              <ChevronRight className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">Quick Compare</span>
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => scrollToSection('iptv-provider-comparison')}
              className="w-full text-xs border-primary/30 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all duration-200"
            >
              IPTV Provider Comparison
            </Button>
            <Button 
              asChild
              size="sm"
              className="w-full text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
            >
              <a href="/#pricing" className="flex items-center justify-center gap-1">
                <Zap className="h-3 w-3" />
                View Our Plans
              </a>
            </Button>
          </div>
        </div>

        <nav className="space-y-1 mb-5">
          {toc.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                w-full text-left text-sm transition-all duration-300 group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50
                ${item.level === 1 ? 'font-medium text-foreground' : ''}
                ${item.level === 2 ? 'ml-4 text-muted-foreground' : ''}
                ${activeId === item.id ? 'text-primary bg-primary/5 font-medium border-l-2 border-primary' : 'border-l-2 border-transparent'}
              `}
            >
              <ChevronRight 
                className={`h-3 w-3 transition-all duration-300 flex-shrink-0 ${
                  activeId === item.id ? 'rotate-90 text-primary' : 'text-muted-foreground/50 group-hover:text-muted-foreground'
                }`} 
              />
              <span className="flex-1 truncate leading-5">{item.text}</span>
            </button>
          ))}
        </nav>
        
        <div className="pt-4 border-t border-border/30">
          <Badge variant="secondary" className="text-xs font-normal bg-muted/50 text-muted-foreground/80 hover:bg-muted/70">
            {toc.length} key sections
          </Badge>
        </div>
      </div>
      
      {/* Collapsed State Summary */}
      {isCollapsed && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{toc.length} key sections</span>
          {activeId && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              Current: {toc.find(item => item.id === activeId)?.text?.slice(0, 15)}...
            </Badge>
          )}
        </div>
      )}
    </Card>
  )
}
