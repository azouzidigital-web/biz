"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Declare the global Tawk_API type
declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
      popup: () => void;
      showWidget: () => void;
      hideWidget: () => void;
      [key: string]: any;
    };
    Tawk_LoadStart?: Date;
  }
}

export function ContactSection() {
  return (
    <section className="w-full pt-4 pb-8 md:pt-6 md:pb-12 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Questions about our eBooks? Need assistance with your purchase? Our support team is here to help. Reach out anytime.
          </p>
        </div>

        {/* Live Chat Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="relative overflow-hidden border-primary/20 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="relative text-center pb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mx-auto mb-6">
                <MessagesSquare className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground mb-3">
                Contact Our Team
              </CardTitle>
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Team Available</span>
              </div>
            </CardHeader>
            
            <CardContent className="relative space-y-8 pb-8">
              <p className="text-center text-lg text-muted-foreground leading-relaxed">
                Connect with our support team. Get help with eBook downloads, content questions, purchases, and general inquiries.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Purchase assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Download support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Content questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm">Account help</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto px-12 py-4 bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    // Open the Tawk.to chat widget
                    if (typeof window !== 'undefined' && window.Tawk_API) {
                      window.Tawk_API.maximize();
                    }
                  }}
                >
                  <MessagesSquare className="h-6 w-6 mr-3" />
                  Send a Message
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    We reply to most inquiries within 24 hours
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Link */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center space-y-4 p-6 bg-card/50 rounded-2xl border border-border/50">
            <h3 className="text-xl font-semibold text-foreground">Looking for Quick Answers?</h3>
            <p className="text-muted-foreground max-w-md">
              Check out our FAQ section for instant answers to questions about purchasing, accessing, and reading your eBooks.
            </p>
            <Button 
              variant="outline" 
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200" 
              asChild
            >
              <a href="/faq">Browse FAQ</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
