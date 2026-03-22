"use client";

import Link from "next/link";
import Image from "next/image";

interface BestSeller {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice: number;
}

const bestSellers: BestSeller[] = [
  {
    id: "consulting-management",
    title: "Consulting Management Explained",
    image: "/images/books/consulting-mgm-1.webp",
    price: 49,
    oldPrice: 99,
  },
  {
    id: "organizational-management",
    title: "Organizational Management Explained",
    image: "/images/books/organizational-mgm-1.webp",
    price: 49,
    oldPrice: 99,
  },
];

const calculateDiscount = (oldPrice: number, price: number): number => {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

export function PopularContentSection() {
  return (
    <section 
      id="popular-content" 
      className="w-full py-12 md:py-20 lg:py-24 bg-background"
      aria-label="Best-selling collection"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 md:mb-4">
            Best-Selling Collection
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our most trusted resources selected by thousands of professionals worldwide
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 md:mb-16">
          {bestSellers.map((book) => (
            <Link 
              key={book.id} 
              href={`/product/${book.id}`}
              className="group flex"
            >
              <article className="w-full h-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border/50 flex flex-col">
                {/* Image Container */}
                <div className="relative w-full aspect-[5/4] overflow-hidden bg-secondary">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:opacity-95 transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {book.title}
                  </h3>

                  {/* Pricing Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        ${book.price}
                      </span>
                      <span className="text-sm line-through text-muted-foreground">
                        ${book.oldPrice}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      Save {calculateDiscount(book.oldPrice, book.price)}%
                    </span>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto pt-4 border-t border-border/30">
                    <button 
                      className="w-full h-12 px-4 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label={`Buy ${book.title} for $${book.price}`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Trust Message */}
        <div className="text-center">
          <p className="text-sm md:text-base text-muted-foreground">
            ✓ 14-day satisfaction guarantee • Instant delivery • Lifetime access
          </p>
        </div>
      </div>
    </section>
  );
}
