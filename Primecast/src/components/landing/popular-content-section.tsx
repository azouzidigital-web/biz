"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Zap, Shield } from "lucide-react";

interface BestSeller {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
}

const bestSellers: BestSeller[] = [
  {
    id: "consulting-management",
    title: "Consulting Management Explained",
    subtitle: "Master frameworks top consultants use every day",
    image: "/images/books/consulting-mgm-1.webp",
    price: 49,
    oldPrice: 99,
    rating: 4.9,
    reviews: 214,
  },
  {
    id: "organizational-management",
    title: "Organizational Management Explained",
    subtitle: "Build teams that execute at the highest level",
    image: "/images/books/organizational-mgm-1.webp",
    price: 49,
    oldPrice: 99,
    rating: 4.8,
    reviews: 187,
  },
];

const calculateDiscount = (oldPrice: number, price: number): number => {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

export function PopularContentSection() {
  return (
    <section
      id="popular-content"
      className="w-full py-16 md:py-24 lg:py-28 bg-gradient-to-b from-secondary/30 to-background"
      aria-label="Best-selling collection"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">

        {/* Section Header */}
        <div className="text-center mb-14 md:mb-18">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            Top Picks
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Best-Selling Collection
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Trusted by thousands of professionals. One purchase, lifetime value.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-14">
          {bestSellers.map((book) => {
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
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Discount Badge */}
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      -{discount}% OFF
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(book.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {book.rating} ({book.reviews} reviews)
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 leading-snug group-hover:text-primary transition-colors duration-200">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                      {book.subtitle}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-5 mt-auto">
                      <span className="text-3xl font-extrabold text-primary">
                        ${book.price}
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        ${book.oldPrice}
                      </span>
                    </div>

                    {/* CTA Button */}
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

        {/* Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Instant digital delivery
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Secure checkout
          </span>
          <span className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary fill-primary" />
            4.8+ average rating
          </span>
        </div>

      </div>
    </section>
  );
}
