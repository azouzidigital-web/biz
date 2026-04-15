"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useScrollToPlan } from "@/hooks/use-scroll-to-plan";
import { useRef } from "react";
import { BookOpen, Star, Users } from "lucide-react";

export function HeroSection() {
  const scrollToPlan = useScrollToPlan();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToPlan('popular-content');
  };

  return (
    <section id="home" className="w-full py-14 md:py-20 lg:py-28 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">

          {/* Eyebrow */}
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
            Business eBooks
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight mb-5">
            <span className="text-primary">Level Up</span> Your Business Knowledge
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Expert-written eBooks packed with clear frameworks, real-world case studies, and strategies you can apply immediately — built for entrepreneurs, managers, and leaders.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button
              ref={buttonRef}
              size="lg"
              className="w-full sm:w-auto font-bold text-base md:text-lg px-10 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-200"
              onClick={handleGetStarted}
            >
              Shop Best Sellers
            </Button>
            <Link
              href="/books"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-[14px] rounded-md border-2 border-primary text-primary font-bold text-base md:text-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Browse All Books
            </Link>
          </div>

          {/* Social Proof Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Premium business eBooks
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Instant digital delivery
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Trusted by professionals
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
