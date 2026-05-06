import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Stripe from "stripe";
import { PurchaseTracker } from "@/components/purchase-tracker";

const EBOOK_DOWNLOAD_LINKS: Record<string, string | undefined> = {
  "top-tier-management": process.env.NEXT_PUBLIC_EBOOK_LINK_TOP_TIER,
  "organizational-management": process.env.NEXT_PUBLIC_EBOOK_LINK_ORGANIZATIONAL,
  "business-development": process.env.NEXT_PUBLIC_EBOOK_LINK_BUSINESS_DEVELOPMENT,
  "consulting-management": process.env.NEXT_PUBLIC_EBOOK_LINK_CONSULTING,
};

const EBOOK_TITLES: Record<string, string> = {
  "top-tier-management": "Top-Tier Management Explained",
  "organizational-management": "Organizational Management Explained",
  "business-development": "Business Development Explained",
  "consulting-management": "Consulting Management Explained",
};

const BOOK_PRICES: Record<string, number> = {
  "top-tier-management": 49,
  "organizational-management": 49,
  "business-development": 49,
  "consulting-management": 49,
};

async function resolvePurchasedBookId(sessionId?: string, fallbackBookId?: string) {
  if (!sessionId) {
    return fallbackBookId;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return fallbackBookId;
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadataBookId = session.metadata?.bookId;
    return metadataBookId || fallbackBookId;
  } catch (error) {
    console.error("Failed to verify checkout session:", error);
    return fallbackBookId;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; book?: string }>;
}) {
  const { session_id: sessionId, book: bookFromUrl } = await searchParams;
  const purchasedBookId = await resolvePurchasedBookId(sessionId, bookFromUrl);
  const bookTitle = purchasedBookId ? EBOOK_TITLES[purchasedBookId] : undefined;
  const bookPrice = purchasedBookId ? BOOK_PRICES[purchasedBookId] : 49;
  const downloadUrl = purchasedBookId ? EBOOK_DOWNLOAD_LINKS[purchasedBookId] : undefined;
  const fallbackProductUrl = purchasedBookId ? `/product/${purchasedBookId}` : "/books";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {purchasedBookId && <PurchaseTracker bookId={purchasedBookId} bookTitle={bookTitle || 'eBook'} price={bookPrice} />}
      <main className="flex-1 flex items-center justify-center py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-16 w-16 md:h-24 md:w-24 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              Thank you for your purchase. Your eBook is ready.
            </p>

            {bookTitle && (
              <p className="text-muted-foreground mb-4">
                Purchased title: <span className="font-semibold text-foreground">{bookTitle}</span>
              </p>
            )}

            <p className="text-muted-foreground mb-8">
              Click below to download your PDF now.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              {downloadUrl ? (
                <Link href={downloadUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    Download eBook (Google Drive)
                  </Button>
                </Link>
              ) : (
                <Link href={fallbackProductUrl} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    Go to Your eBook Page
                  </Button>
                </Link>
              )}

              <Link href={fallbackProductUrl} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Purchased eBook
                </Button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
