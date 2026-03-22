import Link from "next/link";
import { Facebook, Instagram, Twitter, BookOpen } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">Veltrix</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Best-selling business eBooks that explain concepts clearly and help you grow.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/#products" className="text-sm text-muted-foreground hover:text-primary">Products</Link></li>
              <li><Link href="/#about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Get Help</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Veltrix. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/legal/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/legal/terms-of-use" className="text-sm text-muted-foreground hover:text-primary">Terms of Use</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/legal/refund-policy" className="text-sm text-muted-foreground hover:text-primary">Refund Policy</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/sitemap-index.xml" className="text-sm text-muted-foreground hover:text-primary">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
