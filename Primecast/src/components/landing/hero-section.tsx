"use client";

// filepath: /home/influnex/Desktop/iptv/src/components/landing/hero-section.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useScreenSize } from "@/hooks/use-mobile";
import { useScrollToPlan } from "@/hooks/use-scroll-to-plan";
import { useRef } from "react";

export function HeroSection() {
  const { isMobile, isSmallScreen, screenSize } = useScreenSize();
  const scrollToPlan = useScrollToPlan();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleGetStarted = (e: React.MouseEvent) => {
    // For all screen sizes, we want to control the scrolling behavior
    e.preventDefault();
    scrollToPlan('popular-content');
  };

  return (
    <section id="home" className="w-full py-6 xs:py-8 md:py-12 lg:py-20 xl:py-24 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-3 xs:px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-tight mb-1 md:mb-2 lg:mb-3">
            <span className="text-primary">Best Selling</span> Business eBooks
          </h1>
          <p className="mt-3 xs:mt-4 md:mt-5 lg:mt-6 text-sm xs:text-base md:text-lg leading-5 xs:leading-6 md:leading-7 text-muted-foreground sm:text-xl px-2 max-w-3xl mx-auto">
            Discover our most popular business eBooks — clear frameworks, real-world case studies, and actionable tools.
            <span className="hidden md:inline">
              Perfect for entrepreneurs, managers, and leaders who want to win in strategy, execution, and growth.
            </span>
          </p>
          <div className="mt-6 md:mt-8 lg:mt-10 flex items-center justify-center gap-x-4 md:gap-x-6">
            <Button 
              ref={buttonRef}
              asChild 
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow duration-200 will-change-[box-shadow] font-bold text-base xs:text-lg md:text-xl lg:text-2xl px-6 xs:px-8 md:px-12 lg:px-16 py-4 xs:py-5 md:py-6 lg:py-7 bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-2xl"
              onClick={handleGetStarted}
            >
              <Link href="#popular-content">
                Shop Best Sellers
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
