"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
        >
          ← Back to Home
        </Link>
        
        <Card className="p-6 md:p-8 lg:p-10">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p>When you use Veltrix, we collect:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Account information (email, name)</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Viewing preferences and history</li>
                <li>Device information and IP addresses</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide and improve our IPTV services</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send service updates and notifications</li>
                <li>Personalize your viewing experience</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Protection</h2>
              <p>We implement industry-standard security measures to protect your data, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Secure payment processing</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Remember your preferences</li>
                <li>Analyze service usage</li>
                <li>Improve user experience</li>
                <li>Provide personalized content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact Us</h2>
              <p>For privacy-related inquiries, please contact us through our live chat support or visit our contact page.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Updates to Privacy Policy</h2>
              <p>We may update this privacy policy periodically. The latest version will always be posted on this page with the effective date.</p>
            </section>

            <footer className="mt-8 pt-6 border-t border-border">
              <p className="text-sm">Last updated: May 28, 2025</p>
            </footer>
          </div>
        </Card>
      </div>
    </div>
  );
}
