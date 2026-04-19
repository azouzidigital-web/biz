import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Zap, Shield } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All eBooks — Veltrix Business Library",
  description: "Browse all Veltrix business eBooks. Expert-written guides on management, consulting, business development, marketing, and more.",
};

const allBooks = [
  {
    id: "top-tier-management",
    title: "Top-Tier Management Explained",
    subtitle: "Lead with confidence using executive-level frameworks",
    image: "/images/books/top-tier-management.webp",
    price: 49,
    oldPrice: 99,
    rating: 4.9,
    reviews: 0,
    pages: 156,
  },
  {
    id: "consulting-management",
    title: "Consulting Management Explained",
    subtitle: "Master frameworks top consultants use every day",
    image: "/images/books/consulting-mgm-1.webp",
    price: 49,
    oldPrice: 99,
    rating: 4.9,
    reviews: 0,
    pages: 148,
  },
  {
    id: "organizational-management",
    title: "Organizational Management Explained",
    subtitle: "Build teams that execute at the highest level",
    image: "/images/books/organizational-mgm-1.webp",
    price: 49,
    oldPrice: 99,
    rating: 4.8,
    reviews: 0,
    pages: 142,
  },
  {
    id: "business-development",
    title: "Business Development Explained",
    subtitle: "Strategies for sustainable growth and new revenue",
    image: "/images/books/business-dev-1.webp",
    price: 49,
    oldPrice: 99,
    rating: 4.9,
    reviews: 0,
    pages: 148,
  },
];

const calculateDiscount = (oldPrice: number, price: number) =>
  Math.round(((oldPrice - price) / oldPrice) * 100);

export default function BooksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">

            {/* Header */}
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                Full Catalog
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                All Business eBooks
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {allBooks.length} expert-written guides. One-time purchase. Instant download.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
              {allBooks.map((book) => {
                const discount = calculateDiscount(book.oldPrice, book.price);
                return (
                  <Link
                    key={book.id}
                    href={`/product/${book.id}`}
                    className="group flex"
                  >
                    <article className="w-full flex flex-col rounded-2xl overflow-hidden bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                      {/* Image */}
                      <div className="relative w-full aspect-[5/4] overflow-hidden bg-secondary">
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          -{discount}% OFF
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-6">

                        {/* Quality Badge */}
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-3 w-fit">
                          Expert Guide
                        </span>

                        <h2 className="text-lg font-bold text-foreground mb-1 leading-snug group-hover:text-primary transition-colors duration-200">
                          {book.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {book.subtitle}
                        </p>

                        <p className="text-xs text-muted-foreground mb-4">{book.pages} pages · PDF · Instant download</p>

                        <div className="flex items-baseline gap-2 mb-5 mt-auto">
                          <span className="text-3xl font-extrabold text-primary">${book.price}</span>
                          <span className="text-sm line-through text-muted-foreground">${book.oldPrice}</span>
                        </div>

                        <button
                          className="w-full h-12 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          aria-label={`Buy ${book.title} for $${book.price}`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Get Instant Access
                        </button>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>



          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
