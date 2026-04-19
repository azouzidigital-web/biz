"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CTAButton } from "./cta-button";
import { BookOpen, FileText, Layers, Download, Users, TrendingUp } from "lucide-react";
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
    description: "Get immediate access to your eBook after purchase — PDF format, works on any device.",
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
  return (
    <section id="about" className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            Why Veltrix
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            Why These eBooks Work
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Proven approaches for leaders, managers, and entrepreneurs to build momentum and scale.
          </p>
        </div>

        {/* Grid — responsive on all screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-card border-border/50 hover:border-primary/20 hover:-translate-y-0.5"
            >
              <CardHeader className="pb-3">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold leading-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <CTAButton
            text="Shop Best Sellers"
            href="#popular-content"
          />
        </div>
      </div>
    </section>
  );
}
