"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function RefundPolicy() {
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
          <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Refund Eligibility</h2>
              <p>We offer refunds under the following conditions:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Within 24 hours of subscription purchase if no content has been streamed</li>
                <li>Service unavailability exceeding 24 continuous hours</li>
                <li>Technical issues preventing service access (if not resolved within 48 hours)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Non-Refundable Circumstances</h2>
              <p>Refunds will not be issued for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Network or device compatibility issues on the user's end</li>
                <li>Subscription cancellations after the 24-hour window</li>
                <li>Content availability changes</li>
                <li>Violation of our Terms of Use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Refund Process</h2>
              <p>To request a refund:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Contact our support team via live chat</li>
                <li>Provide your subscription details and reason for refund</li>
                <li>Allow up to 5-7 business days for processing</li>
                <li>Refunds will be issued to the original payment method</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Partial Refunds</h2>
              <p>For multi-month subscriptions:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Prorated refunds may be issued for unused months</li>
                <li>Any promotional or discount amounts will be deducted</li>
                <li>Processing fees are non-refundable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Cancellation vs. Refund</h2>
              <p>Understanding the difference:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Cancellation stops future billing but doesn't refund past payments</li>
                <li>Service continues until the end of the current billing period</li>
                <li>Refund requests must be separate from cancellations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact Us</h2>
              <p>For refund-related inquiries, please contact our support team through the live chat feature on our website.</p>
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
