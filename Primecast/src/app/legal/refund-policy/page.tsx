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
              <h2 className="text-xl font-semibold text-foreground mb-3">1. No Refund Policy</h2>
              <p>All purchases made on Veltrix are <strong className="text-foreground">final and non-refundable</strong>. Because our products are digital ebooks that are delivered instantly upon payment, we do not offer refunds, exchanges, or cancellations for any reason once a purchase has been completed.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Why We Do Not Offer Refunds</h2>
              <p>Digital products, including ebooks, are delivered immediately and cannot be returned. Once you have access to the file, the transaction is considered complete. This policy is consistent with industry standards for digital goods.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Please Purchase Carefully</h2>
              <p>We encourage you to review all product descriptions, previews, and details thoroughly before completing your purchase. If you have any questions about a product prior to buying, please contact us via live chat and we will be happy to assist you.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Contact Us</h2>
              <p>For pre-purchase inquiries or any other questions, please reach out to our support team through the live chat feature on our website.</p>
            </section>

            <footer className="mt-8 pt-6 border-t border-border">
              <p className="text-sm">Last updated: April 12, 2026</p>
            </footer>
          </div>
        </Card>
      </div>
    </div>
  );
}
