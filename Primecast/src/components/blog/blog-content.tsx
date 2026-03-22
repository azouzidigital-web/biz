import { BlogPost } from '@/lib/blog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BlogSidebar } from './blog-sidebar'
import { FeaturesComparison } from './features-comparison'
import { CheckCircle, Star, Users, Shield, Zap, Clock } from 'lucide-react'

interface BlogContentProps {
  post: BlogPost
}

export function BlogContent({ post }: BlogContentProps) {
  // Enhanced markdown-to-HTML conversion with modern styling
  const formatContent = (content: string) => {
    return content
      // First handle bold text to avoid conflicts with headings
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground bg-primary/10 px-2 py-1 rounded-md text-sm">$1</strong>')
      // Then process headings
      .replace(/^# (.+)$/gm, (match, heading) => {
        const cleanId = heading.replace(/<[^>]*>/g, '').replace(/[^\w\s-]/g, '').trim();
        return `<h1 id="${cleanId}" class="text-2xl md:text-3xl font-bold mt-8 mb-6 text-foreground border-b border-border/20 pb-4 scroll-mt-20">${heading}</h1>`;
      })
      .replace(/^## (.+)$/gm, (match, heading) => {
        const cleanId = heading.replace(/<[^>]*>/g, '').replace(/[^\w\s-]/g, '').trim();
        return `<h2 id="${cleanId}" class="text-xl md:text-2xl font-semibold mt-12 mb-6 text-foreground flex items-center gap-3 scroll-mt-20"><span class="w-1 h-6 bg-primary rounded-full"></span>${heading}</h2>`;
      })
      .replace(/^### (.+)$/gm, (match, heading) => {
        const cleanId = heading.replace(/<[^>]*>/g, '').replace(/[^\w\s-]/g, '').trim();
        return `<h3 id="${cleanId}" class="text-lg md:text-xl font-semibold mt-10 mb-4 text-foreground scroll-mt-20">${heading}</h3>`;
      })
      .replace(/^#### (.+)$/gm, (match, heading) => {
        const cleanId = heading.replace(/<[^>]*>/g, '').replace(/[^\w\s-]/g, '').trim();
        return `<h4 id="${cleanId}" class="text-base md:text-lg font-semibold mt-8 mb-3 text-foreground scroll-mt-20">${heading}</h4>`;
      })
      // Handle tables - process table blocks
      .replace(/(\|.+\|\n)+/g, (tableBlock) => {
        const lines = tableBlock.trim().split('\n');
        if (lines.length < 2) return tableBlock;
        
        const headerRow = lines[0];
        const separatorRow = lines[1];
        const dataRows = lines.slice(2);
        
        // Check if it's a valid table (has separator row with dashes)
        if (!separatorRow.includes('-')) return tableBlock;
        
        // Parse header
        const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);
        
        // Parse data rows
        const rows = dataRows.map(row => 
          row.split('|').map(cell => cell.trim()).filter(cell => cell)
        ).filter(row => row.length > 0);
        
        // Generate HTML table
        let tableHTML = '<div class="overflow-x-auto my-8"><table class="w-full border-collapse bg-card rounded-lg border border-border shadow-sm">';
        
        // Header
        tableHTML += '<thead class="bg-muted/50"><tr>';
        headers.forEach(header => {
          tableHTML += `<th class="border border-border px-4 py-3 text-left font-semibold text-foreground text-sm">${header}</th>`;
        });
        tableHTML += '</tr></thead>';
        
        // Body
        tableHTML += '<tbody>';
        rows.forEach((row, index) => {
          const rowClass = index % 2 === 0 ? 'bg-background' : 'bg-muted/20';
          tableHTML += `<tr class="${rowClass} hover:bg-muted/30 transition-colors">`;
          row.forEach(cell => {
            tableHTML += `<td class="border border-border px-4 py-3 text-sm text-muted-foreground">${cell}</td>`;
          });
          tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table></div>';
        
        return tableHTML;
      })
      // Handle list items
      .replace(/^\* (.+)$/gm, '<li class="text-muted-foreground flex items-start gap-3 py-2"><span class="text-primary mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-primary"></span><span class="leading-relaxed">$1</span></li>')
      .replace(/(?:^|\n)((?:\* .+(?:\n|$))+)/g, '<ul class="my-6 space-y-1 bg-muted/10 rounded-xl p-6 border border-border/20">$1</ul>')
      // Handle other formatting
      .replace(/`(.+?)`/g, '<code class="bg-muted/50 px-2 py-1 rounded-md text-sm font-mono border border-border/30 text-foreground">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all duration-200 font-medium">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-6 leading-relaxed text-muted-foreground text-base">')
      .replace(/^(?!<[h|u|l])(.+)(?!\>)$/gm, '<p class="mb-6 leading-relaxed text-muted-foreground text-base">$1</p>')
  }

  return (
    <div className="bg-gradient-to-b from-background via-background to-muted/5">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="min-w-0">
            {/* Mobile Table of Contents */}
            <Card className="mb-6 p-4 border border-border/30 bg-card/90 backdrop-blur-sm lg:hidden">
              <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                <div className="p-1 rounded-md bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                Quick Navigation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
                <a href="#introduction" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-1.5 px-2 rounded-md hover:bg-muted/40">
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  <span>Introduction</span>
                </a>
                <a href="#top-providers" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-1.5 px-2 rounded-md hover:bg-muted/40">
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  <span>Top IPTV Providers</span>
                </a>
                <a href="#comparison" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-1.5 px-2 rounded-md hover:bg-muted/40">
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  <span>Detailed Comparison</span>
                </a>
                <a href="#conclusion" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-1.5 px-2 rounded-md hover:bg-muted/40">
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                  <span>Final Verdict</span>
                </a>
              </div>
            </Card>

            {/* Main Article Content */}
            <article className="prose prose-lg max-w-none">
              <div 
                className="blog-content space-y-6"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />
            </article>

            {/* Features Comparison Section */}
            <div className="my-12">
              <FeaturesComparison />
            </div>


          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <BlogSidebar post={post} />
          </div>
        </div>
      </div>
    </div>
  )
}
