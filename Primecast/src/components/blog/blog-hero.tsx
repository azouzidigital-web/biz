export function BlogHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          IPTV Expert Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Your ultimate resource for IPTV streaming guides, device reviews, troubleshooting tips, 
          and everything you need to master the world of Internet Protocol Television.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            📺 Setup Guides
          </span>
          <span className="flex items-center gap-2">
            🔧 Troubleshooting
          </span>
          <span className="flex items-center gap-2">
            📱 Device Reviews
          </span>
          <span className="flex items-center gap-2">
            ⚡ Performance Tips
          </span>
        </div>
      </div>
    </section>
  )
}
