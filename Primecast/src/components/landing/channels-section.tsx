"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CTAButton } from "./cta-button";
import { 
  Search, 
  Tv, 
  Trophy, 
  Globe, 
  Film, 
  Newspaper, 
  Baby, 
  Music, 
  Heart,
  Star,
  Play,
  Zap
} from "lucide-react";

// Define channel data structure
interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  country: string;
  quality: string[];
  description: string;
  popular?: boolean;
  premium?: boolean;
}

// Channel data - expanded with more categories
const channelData: Channel[] = [
  // Canadian Channels
  {
    id: "cbc",
    name: "CBC",
    logo: "/channels/CBC_logo.webp",
    category: "Canadian",
    country: "Canada",
    quality: ["4K", "HD", "SD"],
    description: "Canada's national broadcaster with news, sports, and entertainment",
    popular: true
  },
  {
    id: "ctv",
    name: "CTV",
    logo: "/channels/CTV_logo.webp",
    category: "Canadian",
    country: "Canada",
    quality: ["4K", "HD", "SD"],
    description: "Leading Canadian television network with primetime shows",
    popular: true
  },
  {
    id: "tsn",
    name: "TSN",
    logo: "/channels/TSN_Logo.webp",
    category: "Sports",
    country: "Canada",
    quality: ["4K", "HD", "SD"],
    description: "The Sports Network - Canada's premier sports broadcaster",
    popular: true,
    premium: true
  },
  {
    id: "sportsnet",
    name: "Sportsnet",
    logo: "/channels/Logo_Sportsnet.webp",
    category: "Sports",
    country: "Canada",
    quality: ["4K", "HD", "SD"],
    description: "Complete sports coverage including NHL, MLB, and more",
    popular: true,
    premium: true
  },
  {
    id: "crave",
    name: "Crave",
    logo: "/channels/Crave_logo.webp",
    category: "Entertainment",
    country: "Canada",
    quality: ["4K", "HD", "SD"],
    description: "Premium entertainment with HBO, Showtime, and original content",
    premium: true
  },
  
  // International Premium Channels
  {
    id: "paramount",
    name: "Paramount+",
    logo: "/channels/Paramount_Plus.webp",
    category: "Movies",
    country: "USA",
    quality: ["4K", "HD", "SD"],
    description: "Blockbuster movies and exclusive Paramount content",
    premium: true
  },
  {
    id: "starz",
    name: "Starz",
    logo: "/channels/Starz.webp",
    category: "Movies",
    country: "USA",
    quality: ["4K", "HD", "SD"],
    description: "Premium movie network with original series",
    premium: true
  },
  {
    id: "super-channel",
    name: "Super Channel",
    logo: "/channels/Super_Channel.webp",
    category: "Entertainment",
    country: "Canada",
    quality: ["HD", "SD"],
    description: "Canadian premium movie and entertainment network",
    premium: true
  },
  {
    id: "nba-tv",
    name: "NBA TV Canada",
    logo: "/channels/NBA_TV_Canada.webp",
    category: "Sports",
    country: "Canada",
    quality: ["4K", "HD", "SD"],
    description: "24/7 basketball coverage and NBA games",
    premium: true
  },
  {
    id: "w-network",
    name: "W Network",
    logo: "/channels/W_Network_Logo.webp",
    category: "Entertainment",
    country: "Canada",
    quality: ["HD", "SD"],
    description: "Women-focused programming and lifestyle content"
  }
];

// Sample additional channels for demonstration
const additionalChannels = [
  // Sports
  { name: "ESPN", category: "Sports", country: "USA", popular: true },
  { name: "Fox Sports", category: "Sports", country: "USA", popular: true },
  { name: "NFL Network", category: "Sports", country: "USA", premium: true },
  { name: "NHL Network", category: "Sports", country: "Canada", premium: true },
  { name: "Golf Channel", category: "Sports", country: "USA" },
  { name: "Tennis Channel", category: "Sports", country: "USA" },
  
  // Movies
  { name: "HBO Max", category: "Movies", country: "USA", premium: true },
  { name: "Netflix", category: "Movies", country: "USA", premium: true },
  { name: "Disney+", category: "Movies", country: "USA", premium: true },
  { name: "Amazon Prime", category: "Movies", country: "USA", premium: true },
  { name: "Hulu", category: "Movies", country: "USA", premium: true },
  { name: "Apple TV+", category: "Movies", country: "USA", premium: true },
  
  // News
  { name: "CNN", category: "News", country: "USA", popular: true },
  { name: "BBC World", category: "News", country: "UK", popular: true },
  { name: "Fox News", category: "News", country: "USA", popular: true },
  { name: "MSNBC", category: "News", country: "USA" },
  { name: "Sky News", category: "News", country: "UK" },
  { name: "Al Jazeera", category: "News", country: "Qatar" },
  
  // Entertainment
  { name: "Discovery", category: "Entertainment", country: "USA", popular: true },
  { name: "National Geographic", category: "Entertainment", country: "USA", popular: true },
  { name: "History Channel", category: "Entertainment", country: "USA" },
  { name: "TLC", category: "Entertainment", country: "USA" },
  { name: "Food Network", category: "Entertainment", country: "USA" },
  { name: "HGTV", category: "Entertainment", country: "USA" },
  
  // Kids
  { name: "Cartoon Network", category: "Kids", country: "USA", popular: true },
  { name: "Disney Channel", category: "Kids", country: "USA", popular: true },
  { name: "Nickelodeon", category: "Kids", country: "USA", popular: true },
  { name: "YTV", category: "Kids", country: "Canada", popular: true },
  { name: "Teletoon", category: "Kids", country: "Canada" },
  { name: "PBS Kids", category: "Kids", country: "USA" },
  
  // Music
  { name: "MTV", category: "Music", country: "USA", popular: true },
  { name: "VH1", category: "Music", country: "USA" },
  { name: "Much Music", category: "Music", country: "Canada" },
  { name: "CMT", category: "Music", country: "USA" },
  
  // International
  { name: "TV5", category: "International", country: "France" },
  { name: "RAI", category: "International", country: "Italy" },
  { name: "ARD", category: "International", country: "Germany" },
  { name: "NHK", category: "International", country: "Japan" },
  { name: "CCTV", category: "International", country: "China" },
  { name: "Russia Today", category: "International", country: "Russia" }
];

const categories = [
  { id: "all", label: "All Channels", icon: Tv, count: "55,000+" },
  { id: "Canadian", label: "Canadian", icon: Heart, count: "500+" },
  { id: "Sports", label: "Sports", icon: Trophy, count: "300+" },
  { id: "Movies", label: "Movies", icon: Film, count: "200+" },
  { id: "News", label: "News", icon: Newspaper, count: "150+" },
  { id: "Entertainment", label: "Entertainment", icon: Star, count: "800+" },
  { id: "Kids", label: "Kids", icon: Baby, count: "100+" },
  { id: "Music", label: "Music", icon: Music, count: "50+" },
  { id: "International", label: "International", icon: Globe, count: "1,200+" }
];

export function ChannelsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredChannels = channelData.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getChannelsToShow = () => {
    if (selectedCategory === "all") {
      return channelData.slice(0, 8); // Show featured channels when "All" is selected
    }
    return filteredChannels;
  };

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Complete Channel Lineup
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explore our massive collection of 55,000+ channels from around the world, 
            including 500+ premium Canadian channels with crystal-clear 4K streaming quality.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 md:mb-12">
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">55,000+</div>
            <div className="text-sm text-muted-foreground">Total Channels</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Canadian Channels</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">4K</div>
            <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex flex-col gap-1 py-3 text-xs"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Channel Grid for each category */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                    <category.icon className="h-6 w-6 text-primary" />
                    {category.label}
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </h2>
                </div>
                
                {/* Featured Channels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {getChannelsToShow().map((channel) => (
                    <Card key={channel.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden shadow-sm">
                            <Image
                              src={channel.logo}
                              alt={channel.name}
                              fill
                              className="object-contain p-2"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            {channel.popular && (
                              <Badge variant="default" className="text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                            {channel.premium && (
                              <Badge variant="secondary" className="text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-lg font-semibold">{channel.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {channel.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {channel.quality.map((quality) => (
                            <Badge key={quality} variant="outline" className="text-xs">
                              {quality}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {channel.country}
                          </span>
                          <Button size="sm" variant="ghost" className="text-xs p-1 h-auto">
                            <Play className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Additional Channels List (for demonstration) */}
                {selectedCategory !== "all" && (
                  <div className="bg-card rounded-lg border p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      More {category.label} Channels ({category.count})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                      {additionalChannels
                        .filter(ch => selectedCategory === "all" || ch.category === selectedCategory)
                        .slice(0, 24)
                        .map((channel, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-accent transition-colors">
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <Tv className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{channel.name}</div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {channel.popular && <Star className="w-3 h-3 fill-current" />}
                                {channel.premium && <Zap className="w-3 h-3" />}
                                <span>{channel.country}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {additionalChannels.filter(ch => selectedCategory === "all" || ch.category === selectedCategory).length > 24 && (
                      <div className="text-center mt-4">
                        <Button variant="outline" className="text-sm">
                          View All {category.count} Channels
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quality Features Section */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Premium Streaming Quality</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience every channel in stunning quality with our advanced streaming technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">4K Ultra HD</h3>
              <p className="text-sm text-muted-foreground">
                Crystal-clear picture quality with support for 4K, HDR, and Dolby Vision
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Anti-Freezing™ Technology</h3>
              <p className="text-sm text-muted-foreground">
                Proprietary technology eliminates buffering and ensures smooth playback
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Global CDN</h3>
              <p className="text-sm text-muted-foreground">
                15+ server locations across Canada ensure optimal streaming performance
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Access All These Channels?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get instant access to our complete channel lineup with any subscription plan. 
            All 55,000+ channels included, no tiered pricing or hidden fees.
          </p>
          <CTAButton 
            text="Start Streaming Now 📺" 
            className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg"
            href="/#yearly-plan"
          />
          <p className="text-sm text-muted-foreground mt-3">
            30-day money-back guarantee • No contract required • Instant activation
          </p>
        </div>
      </div>
    </section>
  );
}
