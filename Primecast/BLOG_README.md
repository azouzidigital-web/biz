# Veltrix Blog System - Complete Guide

This document provides a comprehensive guide to the MDX-powered blog system integrated into the Veltrix IPTV website.

## 📁 Blog Directory Structure

```
src/
├── app/
│   └── blog/
│       ├── page.tsx                    # Main blog listing page
│       ├── [slug]/
│       │   └── page.tsx               # Individual blog post pages
│       └── category/
│           └── [category]/
│               └── page.tsx           # Category listing pages
├── components/
│   └── blog/
│       ├── blog-card.tsx              # Blog post card component
│       ├── blog-categories.tsx        # Category navigation component
│       ├── blog-content.tsx           # MDX content renderer
│       ├── blog-header.tsx            # Blog post header
│       ├── blog-hero.tsx              # Blog homepage hero section
│       └── related-posts.tsx          # Related posts component
├── lib/
│   └── blog.ts                        # Blog utility functions
└── types/
    └── global.d.ts                    # TypeScript type definitions

content/
└── blog/                              # Blog post content directory
    ├── complete-iptv-setup-guide-for-beginners-2025.mdx
    ├── how-to-fix-iptv-buffering-issues-10-proven-solutions.mdx
    └── best-iptv-apps-for-android-tv-in-2025-expert-review.mdx

public/
└── blog/
    └── images/                        # Blog post images
        ├── complete-iptv-setup-guide.jpg
        ├── fix-iptv-buffering-issues.jpg
        └── best-iptv-apps-android-tv.jpg

scripts/
└── new-blog.js                        # Automated blog post creation script
```

## 🚀 Creating a New Blog Post

### Method 1: Automated Creation (Recommended)

Use the automated script to quickly create a new blog post template:

```bash
npm run new-blog "Your Blog Post Title Here"
```

**Example:**
```bash
npm run new-blog "Best VPN Services for IPTV Streaming 2025"
```

This creates:
- ✅ MDX file with proper frontmatter
- ✅ SEO-optimized slug
- ✅ Template content structure
- ✅ Placeholder for featured image

### Method 2: Manual Creation

1. **Create the MDX file** in `content/blog/`:
```bash
touch content/blog/your-post-slug.mdx
```

2. **Add frontmatter and content** (see template below)

3. **Add featured image** to `public/blog/images/`

## 📝 Blog Post Template

Every blog post must start with frontmatter containing metadata:

```markdown
---
title: "Your SEO-Optimized Blog Post Title"
description: "A compelling 150-160 character description that will appear in search results and social media shares."
keywords: ["primary keyword", "secondary keyword", "long-tail keyword", "related term"]
category: "Guides"
image: "/blog/images/your-post-slug.jpg"
publishDate: "2025-06-04"
author: "Veltrix Team"
featured: false
---

# Your Blog Post Title

Your engaging introduction paragraph that hooks the reader and provides a clear overview of what they'll learn.

## Main Section Heading

Your content here with proper formatting, lists, and subsections.

### Subsection

- Bullet point 1
- Bullet point 2
- Bullet point 3

### Code Examples (if applicable)

```bash
# Example command
npm install some-package
```

## Conclusion

Summarize the key points and provide a clear call-to-action.

---

*Need help with IPTV setup? [Contact our support team](/contact) or [explore our premium plans](/subscribe).*
```

## 📋 Frontmatter Fields Reference

| Field | Required | Type | Description | Example |
|-------|----------|------|-------------|---------|
| `title` | ✅ | string | SEO-optimized title (50-60 chars) | "How to Fix IPTV Buffering Issues" |
| `description` | ✅ | string | Meta description (150-160 chars) | "Stop IPTV buffering with our expert guide..." |
| `keywords` | ✅ | array | SEO keywords (3-5 recommended) | ["IPTV buffering", "streaming issues"] |
| `category` | ✅ | string | Post category | "Guides", "Reviews", "Troubleshooting" |
| `image` | ✅ | string | Featured image path | "/blog/images/post-slug.jpg" |
| `publishDate` | ✅ | string | Publication date (YYYY-MM-DD) | "2025-06-04" |
| `author` | ✅ | string | Author name | "Veltrix Team" |
| `featured` | ❌ | boolean | Show in featured section | true, false (default) |
| `updatedDate` | ❌ | string | Last update date | "2025-06-05" |

## 🎨 Adding Images

### Featured Images
1. **Size Requirements:**
   - Minimum: 1200x630px (social media optimized)
   - Recommended: 1920x1080px
   - Format: JPG or WebP
   - File size: < 500KB

2. **Save Location:**
```
public/blog/images/your-post-slug.jpg
```

3. **Reference in Frontmatter:**
```yaml
image: "/blog/images/your-post-slug.jpg"
```

### Content Images
Add images within your MDX content:

```markdown
![Alt text description](/blog/images/content-image.jpg)
```

## 📂 Categories

Current available categories:
- **Guides** - Setup tutorials, how-to articles
- **Reviews** - Device and app reviews
- **Troubleshooting** - Problem-solving guides
- **News** - Industry updates and announcements

### Adding New Categories
Simply use a new category name in the frontmatter. The system automatically creates category pages.

## 🔍 SEO Best Practices

### Title Optimization
- 50-60 characters
- Include primary keyword
- Make it compelling and clickable
- Use numbers when applicable: "10 Best...", "5 Ways to..."

### Description Optimization
- 150-160 characters
- Include primary keyword
- Write for humans, not just search engines
- Include a clear benefit or hook

### Keyword Strategy
- 3-5 relevant keywords
- Mix of short and long-tail keywords
- Research with tools like Google Keyword Planner
- Include IPTV-related terms

### Content Structure
- Use H2, H3 headings properly
- Include bullet points and numbered lists
- Add internal links to other blog posts
- Link to relevant product pages

## ⚙️ Development Workflow

### Local Development
1. **Start development server:**
```bash
npm run dev
```

2. **Access blog:**
   - Main blog: `http://localhost:9003/blog`
   - Specific post: `http://localhost:9003/blog/post-slug`
   - Category: `http://localhost:9003/blog/category/guides`

### Building for Production
```bash
npm run build
```

The blog system automatically:
- ✅ Generates static pages for all posts
- ✅ Creates category pages
- ✅ Updates sitemap.xml with primecastiptv.site URLs
- ✅ Optimizes for SEO

## 🔧 Technical Implementation

### Blog Utility Functions
Located in `src/lib/blog.ts`:

```typescript
// Get all blog posts
const posts = getAllPosts()

// Get post by slug
const post = getPostBySlug('post-slug')

// Get posts by category
const categoryPosts = getPostsByCategory('Guides')

// Get featured posts
const featured = getFeaturedPosts(3)

// Get related posts
const related = getRelatedPosts(currentPost, 3)
```

### Component Usage
```tsx
import { BlogCard } from '@/components/blog/blog-card'
import { BlogContent } from '@/components/blog/blog-content'

// Display a blog post card
<BlogCard post={post} featured={true} />

// Render blog content
<BlogContent post={post} />
```

## 📊 Analytics & Performance

### Automatic Features
- **Schema.org markup** for rich snippets
- **Open Graph tags** for social sharing
- **Twitter Cards** for Twitter sharing
- **Canonical URLs** to prevent duplicate content
- **Reading time calculation**
- **Related posts suggestion**

### Performance Optimizations
- Static generation at build time
- Image optimization with Next.js
- Automatic code splitting
- CDN-friendly caching headers

## 🚀 Deployment

### Automatic Deployment
Blog posts are automatically deployed when:
1. You push changes to the main branch
2. Vercel builds the site
3. New static pages are generated
4. CDN cache is updated

### Manual Deployment
```bash
git add content/blog/new-post.mdx
git add public/blog/images/new-image.jpg
git commit -m "Add: New blog post about [topic]"
git push origin main
```

## 📈 Content Strategy

### Recommended Post Types
1. **Setup Guides**
   - "Complete IPTV Setup Guide for [Device]"
   - "How to Install [App] on [Device]"

2. **Troubleshooting**
   - "Fix [Problem] in 5 Easy Steps"
   - "Why [Issue] Happens and How to Solve It"

3. **Reviews**
   - "Best [Device/App] for IPTV in 2025"
   - "[Product] Review: Pros, Cons, and Verdict"

4. **Comparisons**
   - "[Product A] vs [Product B]: Which is Better?"
   - "Free vs Paid IPTV Services: Complete Comparison"

### Content Calendar Template
```markdown
## Week 1: Setup & Beginner Content
- Monday: "IPTV Setup Guide for [Popular Device]"
- Wednesday: "Beginner's Guide to [IPTV Concept]"
- Friday: "Common IPTV Mistakes to Avoid"

## Week 2: Advanced & Troubleshooting
- Monday: "Advanced [Feature] Configuration"
- Wednesday: "Fix [Common Problem]"
- Friday: "Optimize IPTV Performance"

## Week 3: Reviews & Comparisons
- Monday: "[New Device/App] Review"
- Wednesday: "[Product A] vs [Product B]"
- Friday: "Top 10 [Category] for IPTV"
```

## 🛠️ Troubleshooting

### Common Issues

**Blog not showing up:**
1. Check MDX file has proper frontmatter
2. Ensure file is in `content/blog/` directory
3. Verify no syntax errors in frontmatter
4. Restart development server

**Images not loading:**
1. Check image path in frontmatter
2. Ensure image exists in `public/blog/images/`
3. Verify correct file extension
4. Check image file size (< 500KB recommended)

**Build errors:**
1. Validate all MDX frontmatter syntax
2. Check for missing required fields
3. Ensure all images exist
4. Run `npm run typecheck`

### Debug Commands
```bash
# Check blog posts are being read
npm run dev
# Visit: http://localhost:9003/blog

# Build and check for errors
npm run build

# Type checking
npm run typecheck
```

## 📞 Support

For technical issues with the blog system:
1. Check this README first
2. Verify your MDX syntax
3. Test locally before pushing
4. Check the console for error messages

## 🎯 Quick Checklist for New Posts

- [ ] Created MDX file with proper frontmatter
- [ ] Added all required fields (title, description, keywords, etc.)
- [ ] Added featured image (1200x630px minimum)
- [ ] Used proper heading structure (H1, H2, H3)
- [ ] Included internal links where relevant
- [ ] Added call-to-action at the end
- [ ] Tested locally before publishing
- [ ] Optimized for target keywords
- [ ] Proofread for grammar and spelling

---

**Happy blogging! 🎉**

For questions about the blog system, contact the development team or refer to the main project documentation.
