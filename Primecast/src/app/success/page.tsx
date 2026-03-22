import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-24 w-24 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Thank you for your purchase. Your eBook is now available for download.
            </p>
            <p className="text-muted-foreground mb-8">
              A confirmation email has been sent to your email address with your download link and receipt.
            </p>
            {searchParams.session_id && (
              <p className="text-sm text-muted-foreground mb-8">
                Session ID: {searchParams.session_id}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">
                  Back to Home
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
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
