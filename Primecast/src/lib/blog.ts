import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  publishDate: string
  updatedDate?: string
  author: string
  categories: string[]
  keywords: string[]
  image: string
  featured: boolean
  readTime: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(postsDirectory)
  
  const posts = filenames
    .filter(name => name.endsWith('.mdx'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug: filename.replace(/\.mdx$/, ''),
        content,
        readTime: readingTime(content).text,
        updatedDate: data.updatedDate || data.publishDate,
        featured: data.featured || false,
        categories: Array.isArray(data.categories) ? data.categories : [],
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        ...data,
      } as BlogPost
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  
  return posts
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      content,
      readTime: readingTime(content).text,
      updatedDate: data.updatedDate || data.publishDate,
      featured: data.featured || false,
      categories: Array.isArray(data.categories) ? data.categories : [],
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      ...data,
    } as BlogPost
  } catch {
    return null
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(post => 
    post.categories && Array.isArray(post.categories) && 
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  )
}

export function getFeaturedPosts(limit = 3): BlogPost[] {
  return getAllPosts()
    .filter(post => post.featured)
    .slice(0, limit)
}

export function getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  const allPosts = getAllPosts()
  
  return allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => ({
      ...post,
      relevance: calculateRelevance(currentPost.keywords, post.keywords)
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
}

function calculateRelevance(keywords1: string[], keywords2: string[]): number {
  if (!keywords1 || !keywords2 || !Array.isArray(keywords1) || !Array.isArray(keywords2)) {
    return 0
  }
  
  const commonKeywords = keywords1.filter(keyword => 
    keywords2.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
  )
  return commonKeywords.length
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = posts
    .filter(post => post.categories && Array.isArray(post.categories))
    .flatMap(post => post.categories)
    .filter(category => category && typeof category === 'string')
  return Array.from(new Set(categories))
}

export function generateBlogSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://businessexplained.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Business Explained',
      logo: {
        '@type': 'ImageObject',
        url: 'https://businessexplained.com/favicon-32x32.png',
      },
    },
    datePublished: post.publishDate,
    dateModified: post.updatedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://businessexplained.com/blog/${post.slug}`,
    },
    about: {
      '@type': 'Thing',
      name: 'Business eBooks',
      description: 'Business eBooks and professional development guides.'
    }
  }
}
