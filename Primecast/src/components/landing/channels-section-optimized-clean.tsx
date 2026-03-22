"use client";

import { useState } from "react";
import { CTAButton } from "./cta-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tv, 
  Star,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Channel logo mapping - maps channel names to their logo files
const channelLogoMap: { [key: string]: string } = {
  // Popular Canadian Channels
  "CBC Television": "logo_cbctelevision.webp",
  "CBC News Network": "logo_cbcnews.webp",
  "Global TV": "logo_global.webp",
  "CTV": "logo_ctvhd.webp",
  "CTV News Channel": "logo_ctvnewsnet.webp",
  "City TV": "logo_citytv.webp",
  "CP24": "logo_cp24.webp",
  "BNN Bloomberg": "logo_bnnbloomberg.webp",
  
  // Sports Networks
  "TSN (The Sports Network)": "logo_tsn.webp",
  "TSN2": "logo_tsn.webp",
  "Sportsnet": "logo_sportsnet.webp",
  "Sportsnet One": "logo_sportsnetone.webp",
  "Sportsnet 360": "logo_sportsnet360.webp",
  "TVA Sports": "logo_tvasports123.webp",
  "RDS": "logo_rds_rds2.webp",
  "Golf Channel": "logo_golf.webp",
  "NBA TV": "logo_nbacanada.webp",
  "NFL Network": "logo_nfl.webp",
  
  // US News Networks
  "CNN": "logo_cnninternational.webp",
  "Fox News Channel": "logo_foxnews.webp",
  "MSNBC": "logo_msnbc.webp",
  "CNBC": "logo_cnbc.webp",
  "BBC News": "logo_bbcnews.webp",
  "France 24": "logo_france24.webp",
  "Al Jazeera English": "logo_aljazeera.webp",
  
  // Entertainment
  "Showcase": "logo_showcase.webp",
  "CTV Comedy Channel": "logo_ctvcomedy.webp",
  "CTV Drama Channel": "logo_ctvdrama.webp",
  "CTV Sci-Fi Channel (Space)": "logo_ctvscifi.webp",
  "W Network": "logo_wnetwork.webp",
  "Slice": "logo_slice.webp",
  "Lifetime": "logo_lifetime.webp",
  "Fox": "fox_sports.webp",
  "ABC": "logo_abc.webp",
  "NBC": "logo_nbc.webp",
  "CBS": "logo_cbs.webp",
  
  // Kids Channels
  "Disney Channel": "logo_disneychannel.webp",
  "Disney Junior": "logo_disneyjr.webp",
  "Disney XD": "logo_disneyxd.webp",
  "YTV": "logo_ytv.webp",
  "Treehouse": "logo_treehouse.webp",
  "Teletoon": "logo_teletoon.webp",
  "Cartoon Network": "logo_cartoonnetwork.webp",
  "Boomerang": "logo_boomerang.webp",
  
  // Music & Lifestyle
  "Much": "logo_much.webp",
  "CMT": "logo_cmt.webp",
  "Stingray Vibe": "logo_stingrayvibe.webp",
  "HGTV": "logo_homenetwork.webp",
  "Food Network": "logo_flavour.webp",
  "Travel + Escape": "logo_travelescape.webp",
  
  // Specialty
  "History": "logo_history.webp",
  "Discovery": "logo_documentary_0.webp",
  "Animal Planet": "logo_wildtv.webp"
};

const getMostRequestedChannels = () => {
  const popularChannels = [
    { name: "CBC Television", logo: "logo_cbctelevision.webp", category: "Canadian" },
    { name: "TSN (The Sports Network)", logo: "logo_tsn.webp", category: "Sports" },
    { name: "Sportsnet", logo: "logo_sportsnet.webp", category: "Sports" },
    { name: "CTV", logo: "logo_ctvhd.webp", category: "Canadian" },
    { name: "Global TV", logo: "logo_global.webp", category: "Canadian" },
    { name: "CBC News Network", logo: "logo_cbcnews.webp", category: "News" },
    { name: "CP24", logo: "logo_cp24.webp", category: "News" },
    { name: "CNN", logo: "logo_cnninternational.webp", category: "News" },
    { name: "Fox News Channel", logo: "logo_foxnews.webp", category: "News" },
    { name: "BBC News", logo: "logo_bbcnews.webp", category: "News" },
    { name: "Disney Channel", logo: "logo_disneychannel.webp", category: "Kids" },
    { name: "YTV", logo: "logo_ytv.webp", category: "Kids" },
    { name: "Cartoon Network", logo: "logo_cartoonnetwork.webp", category: "Kids" },
    { name: "Much", logo: "logo_much.webp", category: "Music" },
    { name: "CMT", logo: "logo_cmt.webp", category: "Music" },
    { name: "HGTV", logo: "logo_homenetwork.webp", category: "Lifestyle" },
    { name: "Food Network", logo: "logo_flavour.webp", category: "Lifestyle" },
    { name: "History", logo: "logo_history.webp", category: "Education" },
    { name: "Discovery", logo: "logo_documentary_0.webp", category: "Education" },
    { name: "Animal Planet", logo: "logo_wildtv.webp", category: "Lifestyle" },
    { name: "Showcase", logo: "logo_showcase.webp", category: "Entertainment" },
    { name: "CTV Comedy Channel", logo: "logo_ctvcomedy.webp", category: "Entertainment" },
    { name: "CTV Drama Channel", logo: "logo_ctvdrama.webp", category: "Entertainment" },
    { name: "W Network", logo: "logo_wnetwork.webp", category: "Entertainment" },
    { name: "Slice", logo: "logo_slice.webp", category: "Entertainment" },
    { name: "ABC", logo: "logo_abc.webp", category: "Entertainment" },
    { name: "NBC", logo: "logo_nbc.webp", category: "Entertainment" },
    { name: "CBS", logo: "logo_cbs.webp", category: "Entertainment" },
    { name: "Fox", logo: "fox_sports.webp", category: "Entertainment" },
    { name: "TVA Sports", logo: "logo_tvasports123.webp", category: "Sports" },
    { name: "RDS", logo: "logo_rds_rds2.webp", category: "Sports" },
    { name: "Golf Channel", logo: "logo_golf.webp", category: "Sports" },
    { name: "NBA TV", logo: "logo_nbacanada.webp", category: "Sports" },
    { name: "NFL Network", logo: "logo_nfl.webp", category: "Sports" },
    { name: "MSNBC", logo: "logo_msnbc.webp", category: "News" },
    { name: "CNBC", logo: "logo_cnbc.webp", category: "News" },
    { name: "France 24", logo: "logo_france24.webp", category: "News" },
    { name: "Al Jazeera English", logo: "logo_aljazeera.webp", category: "News" },
    { name: "Disney Junior", logo: "logo_disneyjr.webp", category: "Kids" },
    { name: "Disney XD", logo: "logo_disneyxd.webp", category: "Kids" },
    { name: "Treehouse", logo: "logo_treehouse.webp", category: "Kids" },
    { name: "Teletoon", logo: "logo_teletoon.webp", category: "Kids" },
    { name: "Boomerang", logo: "logo_boomerang.webp", category: "Kids" },
    { name: "Stingray Vibe", logo: "logo_stingrayvibe.webp", category: "Music" },
    { name: "Travel + Escape", logo: "logo_travelescape.webp", category: "Lifestyle" },
    { name: "CTV Sci-Fi Channel (Space)", logo: "logo_ctvscifi.webp", category: "Entertainment" },
    { name: "Lifetime", logo: "logo_lifetime.webp", category: "Entertainment" },
    { name: "City TV", logo: "logo_citytv.webp", category: "Canadian" },
    { name: "BNN Bloomberg", logo: "logo_bnnbloomberg.webp", category: "News" }
  ];
  
  return popularChannels;
};

export function ChannelsSection() {
  const [showAllLogos, setShowAllLogos] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      Canadian: "bg-red-500/10 text-red-700 border-red-200",
      Sports: "bg-green-500/10 text-green-700 border-green-200",
      Movies: "bg-purple-500/10 text-purple-700 border-purple-200",
      News: "bg-blue-500/10 text-blue-700 border-blue-200",
      Entertainment: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
      Kids: "bg-pink-500/10 text-pink-700 border-pink-200",
      Music: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
      Lifestyle: "bg-teal-500/10 text-teal-700 border-teal-200",
      Education: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
      Ethnic: "bg-violet-500/10 text-violet-700 border-violet-200",
      Shopping: "bg-amber-500/10 text-amber-700 border-amber-200",
      International: "bg-orange-500/10 text-orange-700 border-orange-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-700 border-gray-200";
  };

  const requestedChannels = getMostRequestedChannels();
  const displayedChannels = showAllLogos ? requestedChannels : requestedChannels.slice(0, 24);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Hero Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Tv className="w-4 h-4" />
            Premium Channels Available
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Premium Channel Collection
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore our curated collection of premium channels from around the world. 
            All channels included in every subscription plan with no additional fees.
          </p>
        </div>

        {/* PREMIUM CHANNEL COLLECTION SHOWCASE */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Most Requested Channels
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Top Premium Networks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Featuring top-rated channels from major Canadian and international broadcasters
            </p>
          </div>

          {/* Channel Logos Grid */}
          <div className="relative">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4 mb-8">
              {displayedChannels.map((channel, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 hover:scale-105"
                >
                  <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-lg">
                    <img
                      src={`/channel_guide/${channel.logo}`}
                      alt={channel.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/channel_guide/logo_placeholder.webp';
                      }}
                    />
                    {/* Category Badge */}
                    <div className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full ${getCategoryColor(channel.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      {channel.category}
                    </div>
                  </div>
                  
                  {/* Channel Name Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {channel.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            <div className="text-center">
              <Button
                onClick={() => setShowAllLogos(!showAllLogos)}
                variant="outline"
                size="lg"
                className="group border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showAllLogos ? 'Show Less' : `View All ${requestedChannels.length} Premium Channels`}
                {showAllLogos ? (
                  <ChevronUp className="w-4 h-4 ml-2 group-hover:translate-y-[-2px] transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-2 group-hover:translate-y-[2px] transition-transform duration-200" />
                )}
              </Button>
            </div>

            {/* Featured Highlights */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">28+</div>
                  <div className="text-sm text-red-700/80">Canadian Networks</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">4K UHD</div>
                  <div className="text-sm text-blue-700/80">Premium Sports</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">24/7</div>
                  <div className="text-sm text-green-700/80">Live Streaming</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
