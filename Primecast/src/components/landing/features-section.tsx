"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CTAButton } from "./cta-button";
import { BookOpen, FileText, Layers, Download, Users, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "Expert Insights",
    description: "Discover cutting-edge strategies and insider knowledge from industry leaders and successful entrepreneurs.",
  },
  {
    icon: Layers,
    title: "Step-by-Step Frameworks",
    description: "Follow proven processes designed to help you make decisions with confidence.",
  },
  {
    icon: BookOpen,
    title: "Real-World Case Studies",
    description: "Learn from real businesses and leaders who applied these strategies successfully.",
  },
  {
    icon: Download,
    title: "Instant Download",
    description: "Get immediate access to your eBook after purchase, with lifetime updates.",
  },
  {
    icon: Users,
    title: "Built for Teams",
    description: "Share insights with your team and build alignment around common frameworks.",
  },
  {
    icon: TrendingUp,
    title: "Proven Growth Strategies",
    description: "Focus on what drives results with tactics that scale and adapt to your business.",
  }
];

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      checkScrollability();
      container.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      
      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 280; // Approximate card width
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="about" className="w-full py-10 md:py-16 lg:py-20 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            Why These eBooks Work
          </h2>
          <p className="text-lg text-muted-foreground">
            Proven approaches for leaders, managers, and entrepreneurs to build momentum and scale.
          </p>
        </div>

        {/* Mobile/Tablet: Horizontal Scroll with Navigation */}
        <div className="relative lg:hidden">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg transition-opacity duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Scroll left</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg transition-opacity duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-30 pointer-events-none'
            }`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Scroll right</span>
          </Button>

          {/* Horizontal Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="flex-none w-72 snap-center"
              >
                <Card className="h-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card border-border/50 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title}>
              <Card className="h-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card border-border/50 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold leading-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="mt-8 md:mt-12 flex justify-center">
          <CTAButton 
            text="Get Started Now" 
            href="#popular-content"
            className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          />
        </div>
      </div>

      {/* Custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
