"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfUse() {
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
          <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using Veltrix services, you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you may not access our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Service Description</h2>
              <p>Veltrix provides:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>IPTV streaming services</li>
                <li>Access to various channels and content</li>
                <li>Multiple device support</li>
                <li>Customer support services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. User Responsibilities</h2>
              <p>Users must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide accurate account information</li>
                <li>Maintain password security</li>
                <li>Use the service for personal, non-commercial purposes only</li>
                <li>Comply with applicable laws and regulations</li>
                <li>Not share or resell account access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Subscription and Billing</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Subscription fees are billed in advance</li>
                <li>Prices may change with notice</li>
                <li>Cancellation process follows our refund policy</li>
                <li>Payment information must be kept current</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Content Usage</h2>
              <p>Users agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Not record, copy, or redistribute content</li>
                <li>Not use VPNs or proxies to circumvent geographical restrictions</li>
                <li>Not attempt to hack or modify the service</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Service Availability</h2>
              <p>PrimeCast:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Strives for 99.9% uptime but doesn't guarantee uninterrupted service</li>
                <li>May perform maintenance with notice</li>
                <li>Reserves the right to modify or discontinue features</li>
                <li>Is not liable for internet or device-related issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Account Termination</h2>
              <p>Veltrix may terminate accounts for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Terms of Use violations</li>
                <li>Fraudulent activity</li>
                <li>Non-payment</li>
                <li>Sharing account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
              <p>Veltrix is not liable for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Content accuracy or availability</li>
                <li>Third-party services or links</li>
                <li>Indirect or consequential damages</li>
                <li>Service interruptions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Information</h2>
              <p>For questions about these Terms of Use, please contact us through our live chat support.</p>
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
