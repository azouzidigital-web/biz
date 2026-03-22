"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Book {
  id: string;
  title: string;
  slug: string;
  image: string;
  images: string[];
  price: number;
  oldPrice: number;
  description: string;
  chapters: string[];
  pages: number;
  rating: number;
  reviews: number;
}

export default function ProductDetail({ book }: { book: Book }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + book.images.length) % book.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.slug,
          title: book.title,
          price: book.price,
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* Product Images Carousel */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xl lg:max-w-2xl aspect-[5/4] relative bg-white rounded-xl overflow-hidden flex items-center justify-center mx-auto">
              <Image
                src={book.images[currentImageIndex]}
                alt={`${book.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover rounded-xl"
                priority
              />

              {/* Navigation Buttons */}
              {book.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {book.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {book.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 bg-white transition-colors ${
                      index === currentImageIndex
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={book.images[index]}
                      alt={`${book.title} - Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {book.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {book.rating} ({book.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {book.description}
              </p>

              {/* Book Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="bg-card/50">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Pages</p>
                    <p className="text-2xl font-bold text-foreground">{book.pages}</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="text-2xl font-bold text-foreground">PDF</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Pricing and CTA */}
            <div>
              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-primary">${book.price}</span>
                <span className="text-xl line-through text-muted-foreground">${book.oldPrice}</span>
                <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100)}% OFF
                </span>
              </div>

              {/* Buy Button */}
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                size="lg"
                className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold py-6"
              >
                {isLoading ? 'Processing...' : `Buy Now - $${book.price}`}
              </Button>

              {/* Benefits */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Instant PDF download after purchase</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Read on any device offline</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>14-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Lifetime access and updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="max-w-5xl lg:max-w-6xl mx-auto mt-20 px-4 md:px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">What's Inside</h2>
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.chapters.map((chapter, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-border/30 last:border-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground">{chapter}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose This eBook */}
        <div className="max-w-5xl lg:max-w-6xl mx-auto mt-20 px-4 md:px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">Why Choose This eBook</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Expert-Written</h3>
                <p className="text-sm text-muted-foreground">
                  Authored by industry experts with years of real-world experience and proven track records.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Actionable Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Practical frameworks and strategies you can implement immediately in your business.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-2">Real Examples</h3>
                <p className="text-sm text-muted-foreground">
                  Learn from case studies and real-world examples of successful implementations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
