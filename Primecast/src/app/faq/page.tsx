import { FAQSection } from "@/components/landing/faq-section";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions About Our eBooks",
  description: "Find answers to common questions about purchasing, accessing, and reading our business eBooks.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
