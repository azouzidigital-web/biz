#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const title = process.argv[2]
if (!title) {
  console.log('Usage: npm run new-blog "Your Blog Title"')
  console.log('Example: npm run new-blog "Best IPTV Apps for Android TV 2025"')
  process.exit(1)
}

const slug = title.toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')

const today = new Date().toISOString().split('T')[0]

const template = `---
title: "${title}"
description: "Add your comprehensive description here for SEO"
keywords: ["IPTV", "streaming", "keyword2", "keyword3"]
category: "Guides"
image: "/blog/images/${slug}.jpg"
publishDate: "${today}"
author: "Veltrix Team"
featured: false
---

# ${title}

Write your engaging introduction here that hooks the reader and explains what they'll learn.

## What You'll Learn

- Key point 1
- Key point 2  
- Key point 3

## Main Content Section

Write your detailed content here with step-by-step instructions, tips, and expert insights.

### Subsection 1

Detailed explanation with examples.

### Subsection 2

More valuable information for your readers.

## Key Takeaways

- Important point 1
- Important point 2
- Important point 3

## Conclusion

Summarize the main points and provide a clear call-to-action or next steps for readers.

---

*Need help with IPTV setup? [Contact our support team](/contact) or check out our [premium IPTV packages](/subscribe).*
`

const contentDir = path.join(process.cwd(), 'content', 'blog')
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true })
}

const filePath = path.join(contentDir, `${slug}.mdx`)

if (fs.existsSync(filePath)) {
  console.log(`❌ Blog post already exists: ${slug}.mdx`)
  process.exit(1)
}

fs.writeFileSync(filePath, template)

console.log(`✅ Created new blog post: ${slug}.mdx`)
console.log(`📝 Next steps:`)
console.log(`   1. Edit the file: content/blog/${slug}.mdx`)
console.log(`   2. Add your content and update the description`)
console.log(`   3. Add an image: public/blog/images/${slug}.jpg`)
console.log(`   4. Update keywords and category as needed`)
console.log(`   5. Set featured: true if you want it highlighted`)
console.log(``)
console.log(`🌐 Preview URL: http://localhost:9003/blog/${slug}`)
