import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ChannelsSection } from "@/components/landing/channels-section-optimized";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channel List - PrimeCast | 20,000+ Channels Available",
  description: "Sample of our extensive channel lineup featuring Canadian channels like CBC, TSN, Sportsnet, and 20,000+ international channels. 4K streaming quality.",
  keywords: [
    "iptv channels",
    "canadian iptv channels", 
    "channel list",
    "tv channels",
    "sports channels",
    "movie channels",
    "news channels",
    "international channels",
    "primecast channels"
  ],
  openGraph: {
    title: "Channel List - Veltrix | 20,000+ Channels",
    description: "Sample channel lineup with Canadian and international content from our 20,000+ channel collection",
    type: "website",
  },
};

export default function ChannelsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ChannelsSection />
      </main>
      <Footer />
    </div>
  );
}
