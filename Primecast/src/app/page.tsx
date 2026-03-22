import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PopularContentSection } from "@/components/landing/popular-content-section";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <PopularContentSection />
        <FeaturesSection />
        <ReviewsSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
