"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { CTAButton } from "./cta-button";
import blurPlaceholders from "@/data/blur-placeholders.json";

interface ContentItem {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  dataAiHint: string;
  blurDataUrl?: string;
}

const popularContent: ContentItem[] = [
  {
    id: "1",
    title: "Ted Lasso",
    imageUrl: "/images/Ted Lasso.webp",
    imageAlt: "Poster for Ted Lasso",
    dataAiHint: "Ted Lasso TV show",
    blurDataUrl: blurPlaceholders["Ted Lasso.webp"]
  },
  {
    id: "2",
    title: "The Last of Us",
    imageUrl: "/images/the last of us.webp",
    imageAlt: "Poster for The Last of Us",
    dataAiHint: "The Last of Us TV show",
    blurDataUrl: blurPlaceholders["the last of us.webp"]
  },
  {
    id: "3",
    title: "House of the Dragon",
    imageUrl: "/images/House of the Dragon.webp",
    imageAlt: "Poster for House of the Dragon",
    dataAiHint: "House of the Dragon TV show",
    blurDataUrl: blurPlaceholders["House of the Dragon.webp"]
  },
  {
    id: "4",
    title: "Clarkson's Farm",
    imageUrl: "/images/Clarkson's Farm.webp",
    imageAlt: "Poster for Clarkson's Farm",
    dataAiHint: "Clarkson's Farm TV show",
    blurDataUrl: blurPlaceholders["Clarkson's Farm.webp"]
  },
  {
    id: "5",
    title: "Cold Case: The Tylenol Murders",
    imageUrl: "/images/Cold Case_ The Tylenol Murders.webp",
    imageAlt: "Poster for Cold Case: The Tylenol Murders",
    dataAiHint: "Cold Case: The Tylenol Murders TV show",
    blurDataUrl: blurPlaceholders["Cold Case_ The Tylenol Murders.webp"]
  },
  {
    id: "6",
    title: "MobLand",
    imageUrl: "/images/MobLand.webp",
    imageAlt: "Poster for MobLand",
    dataAiHint: "MobLand movie",
    blurDataUrl: blurPlaceholders["MobLand.webp"]
  },
  {
    id: "7",
    title: "A Working Man",
    imageUrl: "/images/A Working Man.webp",
    imageAlt: "Poster for A Working Man",
    dataAiHint: "A Working Man movie",
    blurDataUrl: blurPlaceholders["A Working Man.webp"]
  },
];

export function PopularContentSection() {
  const [api, setApi] = useState<CarouselApi>();
  const sectionRef = useRef<HTMLElement>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Preload critical images in document head for instant display (only in production/Netlify)
  useEffect(() => {
    if (isDevelopment) return; // Skip preloading in development
    
    const criticalImages = popularContent.slice(0, 4);
    
    criticalImages.forEach(item => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = item.imageUrl;
      document.head.appendChild(link);
    });

    // Cleanup function to remove preload links
    return () => {
      const preloadLinks = document.head.querySelectorAll('link[rel="preload"][as="image"]');
      preloadLinks.forEach(link => {
        if (criticalImages.some(item => item.imageUrl === link.getAttribute('href'))) {
          document.head.removeChild(link);
        }
      });
    };
  }, [isDevelopment]);

  // Prefetch remaining images after critical ones load (only in production/Netlify)
  useEffect(() => {
    if (isDevelopment) return; // Skip prefetching in development
    
    const timer = setTimeout(() => {
      const remainingImages = popularContent.slice(4);
      remainingImages.forEach(item => {
        const img = new Image();
        img.src = item.imageUrl;
      });
    }, 1000); // Wait 1 second before prefetching remaining images

    return () => clearTimeout(timer);
  }, [isDevelopment]);

  useEffect(() => {
    if (!api) return;

    let timer: number;

    const play = () => {
      stop();
      timer = window.setTimeout(next, 4000); // Increased from 2500ms for better UX
    };

    const stop = () => {
      if (timer) window.clearTimeout(timer);
    };

    const next = () => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
      play();
    };

    play();
    return stop;
  }, [api]);

  return (
    <section 
      ref={sectionRef}
      id="popular-content" 
      className="w-full py-8 md:py-12 lg:py-16 bg-background overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto text-center mb-8 md:mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Favorite Movies &amp; TV Shows
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover trending content popular worldwide and enjoy it on any device.
          </p>
        </div>

        <div className="relative max-w-[1400px] mx-auto">
          <Carousel
            setApi={setApi}
            opts={{ 
              align: "start", 
              loop: true,
              dragFree: true,
              skipSnaps: true
            }}
            className="w-full"
          >
            <CarouselContent>
              {popularContent.map((item, index) => (
                <CarouselItem key={item.id} className="basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1.5 sm:p-2 md:p-3">
                    <div className="rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                      <Card className="shadow-xl hover:shadow-2xl overflow-hidden transition-shadow duration-200 border-0">
                        <CardContent className="p-0">
                          <div className="aspect-[2/3] w-full relative rounded-lg overflow-hidden">
                            {isDevelopment ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.imageAlt}
                                fill
                                priority={index < 4}
                                placeholder={item.blurDataUrl ? "blur" : "empty"}
                                blurDataURL={item.blurDataUrl}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-opacity duration-300 ease-in-out"
                                quality={85}
                                data-ai-hint={item.dataAiHint}
                              />
                            ) : (
                              <img
                                src={item.imageUrl}
                                alt={item.imageAlt}
                                loading={index < 4 ? "eager" : "lazy"}
                                decoding="async"
                                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                                style={{
                                  backgroundImage: item.blurDataUrl ? `url(${item.blurDataUrl})` : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                                onLoad={(e) => {
                                  const img = e.target as HTMLImageElement;
                                  img.style.backgroundImage = 'none';
                                }}
                                data-ai-hint={item.dataAiHint}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        
        <div className="flex justify-center mt-10 px-4">
          <CTAButton 
            text="Stream & Chill 🍿" 
            className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90 max-w-md mx-auto"
            href="#yearly-plan"
          />
        </div>
      </div>
    </section>
  );
}
