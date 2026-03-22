"use client";

import { CheckCircle, Star } from "lucide-react";
import { CTAButton } from "./cta-button";

const testimonials = [
  {
    id: 1,
    quote: "These guides helped me structure my entire business model and gave me the confidence to scale quickly.",
    author: "Alicia Rivera",
    title: "Founder & CEO",
    company: "TechStart Inc.",
    rating: 5,
    date: "2 months ago",
    verified: true,
  },
  {
    id: 2,
    quote: "The templates and frameworks are crystal clear — I implemented them within days and saw results immediately.",
    author: "Marcus Lee",
    title: "Operations Lead",
    company: "Global Solutions Ltd.",
    rating: 4,
    date: "1 month ago",
    verified: false,
  },
  {
    id: 3,
    quote: "A must-read for anyone serious about leadership and growth. Practical, concise, and actionable.",
    author: "Nina Patel",
    title: "Marketing Director",
    company: "Creative Ventures",
    rating: 5,
    date: "3 weeks ago",
    verified: true,
  },
  {
    id: 4,
    quote: "The business development framework transformed how we approach client relationships. ROI was immediate.",
    author: "James Wilson",
    title: "Sales Manager",
    company: "Enterprise Partners",
    rating: 5,
    date: "2 weeks ago",
    verified: false,
  },
  {
    id: 5,
    quote: "Finally, a resource that doesn't waste time on theory. Pure, actionable insights I use every single day.",
    author: "Sarah Chen",
    title: "Business Owner",
    company: "Sarah Chen Consulting",
    rating: 4,
    date: "1 week ago",
    verified: true,
  },
  {
    id: 6,
    quote: "Our entire leadership team went through this. Best investment we made for team alignment this year.",
    author: "David Thompson",
    title: "VP of Strategy",
    company: "Fortune 500 Tech",
    rating: 5,
    date: "3 days ago",
    verified: false,
  },
];

export function ReviewsSection() {
  return (
    <section id="reviews" className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 xs:mb-10 md:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-2 xs:mb-3 sm:mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-muted-foreground">
            See what successful professionals are saying about our eBooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/40 flex flex-col">
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-grow italic">&quot;{item.quote}&quot;</p>

              {/* Author Info */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {item.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  {/* Author Details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.author}</p>
                    <p className="text-xs text-gray-600 truncate">{item.title}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center px-4">
          <CTAButton text="Get Started Now" href="#popular-content" />
        </div>
      </div>
    </section>
  );
}
