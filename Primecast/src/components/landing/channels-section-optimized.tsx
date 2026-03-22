"use client";

import { useState, useMemo } from "react";
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

// Ultra-fast Image Component - NO LOADING STATES, INSTANT DISPLAY
interface OptimizedChannelImageProps {
  src: string;
  alt: string;
}

const OptimizedChannelImage: React.FC<OptimizedChannelImageProps> = ({ 
  src, 
  alt
}) => {
  return (
    <div className="relative w-full h-full">      
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        style={{
          imageRendering: 'crisp-edges',
          willChange: 'transform',
        }}
      />
    </div>
  );
};

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
  const allChannels = [
    // ★★★ HIGH ROI SPORTS NETWORKS - TOP PRIORITY ★★★
    { name: "TSN", logo: "logo_tsn.webp", category: "Sports" },
    { name: "TSN 4K", logo: "logo_tsn4k.webp", category: "Sports" },
    { name: "Sportsnet", logo: "logo_sportsnet.webp", category: "Sports" },
    { name: "Sportsnet One", logo: "logo_sportsnetone.webp", category: "Sports" },
    { name: "Sportsnet 360", logo: "logo_sportsnet360.webp", category: "Sports" },
    { name: "Sportsnet 4K", logo: "logo_sportsnet4k.webp", category: "Sports" },
    { name: "Sportsnet One 4K", logo: "logo_sportsnetone4k.webp", category: "Sports" },
    { name: "TVA Sports", logo: "logo_tvasports123.webp", category: "Sports" },
    { name: "RDS", logo: "logo_rds_rds2.webp", category: "Sports" },
    { name: "RDS Info", logo: "logo_rdsinfo.webp", category: "Sports" },
    { name: "Golf Channel", logo: "logo_golf.webp", category: "Sports" },
    { name: "NBA TV Canada", logo: "logo_nbacanada.webp", category: "Sports" },
    { name: "NFL Network", logo: "logo_nfl.webp", category: "Sports" },
    { name: "Fox Sports", logo: "fox_sports.webp", category: "Sports" },
    { name: "Big Ten Network", logo: "logo_bigten.webp", category: "Sports" },
    
    // ★★★ PREMIUM US ENTERTAINMENT - HIGH ROI ★★★
    { name: "HBO Max", logo: "logo_max.webp", category: "Entertainment" },
    { name: "ABC", logo: "logo_abc.webp", category: "Entertainment" },
    { name: "NBC", logo: "logo_nbc.webp", category: "Entertainment" },
    { name: "CBS", logo: "logo_cbs.webp", category: "Entertainment" },
    { name: "Fox", logo: "logo_fox.webp", category: "Entertainment" },
    { name: "FX Canada", logo: "logo_fxcanada.webp", category: "Entertainment" },
    { name: "FXX", logo: "logo_fxx.webp", category: "Entertainment" },
    { name: "USA Network", logo: "logo_usanetwork.webp", category: "Entertainment" },
    
    // ★★★ ESSENTIAL NEWS NETWORKS - HIGH ROI ★★★
    { name: "CNN International", logo: "logo_cnninternational.webp", category: "News" },
    { name: "Fox News Channel", logo: "logo_foxnews.webp", category: "News" },
    { name: "MSNBC", logo: "logo_msnbc.webp", category: "News" },
    { name: "CNBC", logo: "logo_cnbc.webp", category: "News" },
    { name: "BBC News", logo: "logo_bbcnews.webp", category: "News" },
    { name: "CBC News Network", logo: "logo_cbcnews.webp", category: "News" },
    { name: "CP24", logo: "logo_cp24.webp", category: "News" },
    { name: "BNN Bloomberg", logo: "logo_bnnbloomberg.webp", category: "News" },
    
    // ★★★ PREMIUM ENTERTAINMENT - HIGH ROI ★★★
    { name: "Showcase", logo: "logo_showcase.webp", category: "Entertainment" },
    { name: "W Network", logo: "logo_wnetwork.webp", category: "Entertainment" },
    { name: "Slice", logo: "logo_slice.webp", category: "Entertainment" },
    { name: "Lifetime", logo: "logo_lifetime.webp", category: "Entertainment" },
    { name: "Super Channel Heart & Home", logo: "logo_super_channelhd1.webp", category: "Entertainment" },
    { name: "Super Channel Fuse", logo: "logo_super_channelhd2.webp", category: "Entertainment" },
    { name: "Super Channel Vault", logo: "logo_superchannel_vault.webp", category: "Entertainment" },
    { name: "Hollywood Suite", logo: "logo_hollywoodsuitenew.webp", category: "Entertainment" },
    
    // ★★★ TOP CANADIAN NETWORKS - CORE CONTENT ★★★
    { name: "CBC Television", logo: "logo_cbctelevision.webp", category: "Canadian" },
    { name: "CTV", logo: "logo_ctvhd.webp", category: "Canadian" },
    { name: "Global TV", logo: "logo_global.webp", category: "Canadian" },
    { name: "City TV", logo: "logo_citytv.webp", category: "Canadian" },
    { name: "CTV Comedy Channel", logo: "logo_ctvcomedy.webp", category: "Canadian" },
    { name: "CTV Drama Channel", logo: "logo_ctvdrama.webp", category: "Canadian" },
    { name: "CTV News Channel", logo: "logo_ctvnewsnet.webp", category: "Canadian" },
    
    // ADDITIONAL CANADIAN NETWORKS
    { name: "CTV Life Channel", logo: "logo_ctvlife.webp", category: "Canadian" },
    { name: "CTV Nature", logo: "logo_ctvnature.webp", category: "Canadian" },
    { name: "CTV Sci-Fi Channel", logo: "logo_ctvscifi.webp", category: "Canadian" },
    { name: "CTV Speed", logo: "logo_ctvspeed.webp", category: "Canadian" },
    { name: "CTV Two", logo: "logo_ctvtwo.webp", category: "Canadian" },
    { name: "CTV Wild", logo: "logo_ctvwild.webp", category: "Canadian" },
    { name: "OMNI 1", logo: "logo_omni1.webp", category: "Canadian" },
    { name: "OMNI 2", logo: "logo_omni2.webp", category: "Canadian" },
    { name: "OMNI East", logo: "logo_omnieast.webp", category: "Canadian" },
    { name: "Your TV", logo: "logo_yourtv.webp", category: "Canadian" },
    { name: "ONE", logo: "logo_one.webp", category: "Canadian" },
    
    // French Canadian Networks
    { name: "TVA", logo: "logo_tva.webp", category: "French" },
    { name: "ICI Radio-Canada", logo: "logo_iciradiocanada.webp", category: "French" },
    { name: "ICI ARTV", logo: "logo_iciartv.webp", category: "French" },
    { name: "ICI Explora", logo: "logo_iciexplora.webp", category: "French" },
    { name: "ICI RDI", logo: "logo_icirdi.webp", category: "French" },
    { name: "Noovo", logo: "logo_noovo.webp", category: "French" },
    { name: "Canal D", logo: "logo_canald.webp", category: "French" },
    { name: "Canal Vie", logo: "logo_canalvie.webp", category: "French" },
    { name: "Historia", logo: "logo_historia.webp", category: "French" },
    { name: "Série+", logo: "logo_seriesplus.webp", category: "French" },
    { name: "Z Télé", logo: "logo_ztele.webp", category: "French" },
    { name: "Zeste", logo: "logo_zeste.webp", category: "French" },
    { name: "Évasion", logo: "logo_evasion.webp", category: "French" },
    { name: "Planète+", logo: "logo_planeteplus.webp", category: "French" },
    { name: "TV5", logo: "logo_tv5.webp", category: "French" },
    { name: "UNIS TV", logo: "logo_unis.webp", category: "French" },
    { name: "LCN", logo: "logo_lcn.webp", category: "French" },
    { name: "MétéoMédia", logo: "logo_meteomedia.webp", category: "French" },
    { name: "Elle Fictions", logo: "logo_ellefictions.webp", category: "French" },
    { name: "Cinépop", logo: "logo_cinepop.webp", category: "French" },
    
    // Additional Sports Networks
    { name: "AXS TV", logo: "logo_axs.webp", category: "Sports" },
    
    // Additional News Networks
    { name: "CNN HLN", logo: "logo_cnn_hln.webp", category: "News" },
    { name: "France 24", logo: "logo_france24.webp", category: "News" },
    { name: "News Forum", logo: "logo_newsforum.webp", category: "News" },
    
    // Additional Premium Entertainment
    { name: "ABC Spark", logo: "logo_abc_spark.webp", category: "Entertainment" },
    { name: "Silver Screen Classics", logo: "logo_silver_screen.webp", category: "Entertainment" },
    { name: "Rewind", logo: "logo_rewind.webp", category: "Entertainment" },
    { name: "DejaView", logo: "logo_dejaview.webp", category: "Entertainment" },
    { name: "Movie Time", logo: "logo_movietime.webp", category: "Entertainment" },
    { name: "REV TV", logo: "logo_revtv.webp", category: "Entertainment" },
    { name: "Everything Entertainment", logo: "logo_everythingentertainment.webp", category: "Entertainment" },
    { name: "Addik", logo: "logo_addik.webp", category: "Entertainment" },
    { name: "DTour", logo: "logo_dtour.webp", category: "Entertainment" },
    { name: "Oxygen", logo: "logo_oxygen.webp", category: "Entertainment" },
    
    // Kids & Family (High Retention)
    { name: "Disney Channel", logo: "logo_disneychannel.webp", category: "Kids" },
    { name: "Disney Junior", logo: "logo_disneyjr.webp", category: "Kids" },
    { name: "Disney XD", logo: "logo_disneyxd.webp", category: "Kids" },
    { name: "YTV", logo: "logo_ytv.webp", category: "Kids" },
    { name: "Treehouse", logo: "logo_treehouse.webp", category: "Kids" },
    { name: "Teletoon", logo: "logo_teletoon.webp", category: "Kids" },
    { name: "Cartoon Network", logo: "logo_cartoonnetwork.webp", category: "Kids" },
    { name: "Boomerang", logo: "logo_boomerang.webp", category: "Kids" },
    { name: "Family Channel", logo: "logo_tfn.webp", category: "Kids" },
    { name: "WildBrain", logo: "logo_wildbrain.webp", category: "Kids" },
    { name: "TVO", logo: "logo_tvo.webp", category: "Kids" },
    { name: "TFO", logo: "logo_tfo.webp", category: "Kids" },
    { name: "Teletoon Retro", logo: "logo_toonavision.webp", category: "Kids" },
    
    // Documentary & Educational (Strong Niche Appeal)
    { name: "Discovery Channel", logo: "logo_documentary_0.webp", category: "Education" },
    { name: "History", logo: "logo_history.webp", category: "Education" },
    { name: "National Geographic", logo: "logo_natgeo.webp", category: "Education" },
    { name: "National Geographic Wild", logo: "logo_nationalgeo.webp", category: "Education" },
    { name: "Smithsonian Channel", logo: "logo_smithsonian.webp", category: "Education" },
    { name: "Wild TV", logo: "logo_wildtv.webp", category: "Education" },
    { name: "Love Nature", logo: "logo_lovenature.webp", category: "Education" },
    { name: "BBC Earth", logo: "logo_bbcearth2.webp", category: "Education" },
    { name: "BBC First", logo: "logo_bbcfirst.webp", category: "Education" },
    { name: "Crime + Investigation", logo: "logo_crimeinvestigation.webp", category: "Education" },
    { name: "A&E", logo: "logo_ae.webp", category: "Education" },
    { name: "American Heroes Channel", logo: "logo_ahc.webp", category: "Education" },
    { name: "H2", logo: "logo_h2.webp", category: "Education" },
    { name: "Quest", logo: "logo_quest.webp", category: "Education" },
    { name: "PBS", logo: "logo_pbs.webp", category: "Education" },
    
    // Lifestyle & Reality
    { name: "Home Network", logo: "logo_homenetwork.webp", category: "Lifestyle" },
    { name: "Flavour Network", logo: "logo_flavour.webp", category: "Lifestyle" },
    { name: "Travel + Escape", logo: "logo_travelescape.webp", category: "Lifestyle" },
    { name: "TLC", logo: "logo_tlc.webp", category: "Lifestyle" },
    { name: "Cottage Life", logo: "logo_cottagelife.webp", category: "Lifestyle" },
    { name: "Makeful", logo: "logo_makeful.webp", category: "Lifestyle" },
    { name: "Game Show Network", logo: "logo_gsn.webp", category: "Lifestyle" },
    { name: "OUTtv", logo: "logo_outtv.webp", category: "Lifestyle" },
    { name: "The Weather Network", logo: "logo_theweathernetwork.webp", category: "Lifestyle" },
    { name: "GamePlus", logo: "logo_gameplus.webp", category: "Lifestyle" },
    
    // Music & Arts
    { name: "Much", logo: "logo_much.webp", category: "Music" },
    { name: "CMT", logo: "logo_cmt.webp", category: "Music" },
    { name: "Stingray Vibe", logo: "logo_stingrayvibe.webp", category: "Music" },
    { name: "Stingray Loud", logo: "logo_stingrayloud.webp", category: "Music" },
    { name: "Stingray Country", logo: "logo_stingraycountry.webp", category: "Music" },
    { name: "Stingray Retro", logo: "logo_stingrayretro.webp", category: "Music" },
    { name: "Stingray Classica", logo: "logo_stingrayclassica.webp", category: "Music" },
    { name: "Mezzo Live HD", logo: "logo_mezzolivehd.webp", category: "Music" },
    
    // Documentary & Educational
    { name: "Discovery Channel", logo: "logo_documentary_0.webp", category: "Education" },
    { name: "History", logo: "logo_history.webp", category: "Education" },
    { name: "National Geographic", logo: "logo_natgeo.webp", category: "Education" },
    { name: "National Geographic Wild", logo: "logo_nationalgeo.webp", category: "Education" },
    { name: "Smithsonian Channel", logo: "logo_smithsonian.webp", category: "Education" },
    { name: "Wild TV", logo: "logo_wildtv.webp", category: "Education" },
    { name: "Love Nature", logo: "logo_lovenature.webp", category: "Education" },
    { name: "BBC Earth", logo: "logo_bbcearth2.webp", category: "Education" },
    { name: "BBC First", logo: "logo_bbcfirst.webp", category: "Education" },
    { name: "Crime + Investigation", logo: "logo_crimeinvestigation.webp", category: "Education" },
    { name: "A&E", logo: "logo_ae.webp", category: "Education" },
    { name: "American Heroes Channel", logo: "logo_ahc.webp", category: "Education" },
    { name: "H2", logo: "logo_h2.webp", category: "Education" },
    { name: "Quest", logo: "logo_quest.webp", category: "Education" },
    { name: "PBS", logo: "logo_pbs.webp", category: "Education" },
    
    // Indigenous & Cultural
    { name: "APTN", logo: "logo_aptn.webp", category: "Cultural" },
    { name: "APTN Languages", logo: "logo_aptnl.webp", category: "Cultural" },
    { name: "AMI-télé", logo: "logo_amitele.webp", category: "Cultural" },
    { name: "AMI-tv", logo: "logo_amitv.webp", category: "Cultural" },
    { name: "AMI Audio", logo: "logo_ami-audio.webp", category: "Cultural" },
    { name: "Vision TV", logo: "logo_vision.webp", category: "Cultural" },
    { name: "JLTV", logo: "logo_jltv.webp", category: "Cultural" },
    { name: "YES TV", logo: "logo_yestv.webp", category: "Cultural" },
    { name: "Uvagut TV", logo: "logo_uvagut.webp", category: "Cultural" },
    
    // Government & Information
    { name: "CPAC", logo: "logo_cpac.webp", category: "Information" },
    { name: "CPAC (English)", logo: "logo_cpac_en.webp", category: "Information" },
    { name: "Legislative Assembly Ontario", logo: "logo_legislative_assembly_ontario.webp", category: "Information" },
    
    // Shopping & Specialty
    { name: "The Shopping Channel", logo: "logo_tsc.webp", category: "Shopping" },
    { name: "CASA", logo: "logo_casa.webp", category: "Shopping" },
    
    // International
    { name: "Nickel", logo: "logo_nickel.webp", category: "International" },
    { name: "Sportsman Channel", logo: "logo_sportsman.webp", category: "International" },
    { name: "Témon", logo: "temoin.webp", category: "International" }
  ];
  
  return allChannels;
};

export function ChannelsSection() {
  const [showAllLogos, setShowAllLogos] = useState(false);

  // Memoize channel data to avoid recalculating
  const requestedChannels = useMemo(() => getMostRequestedChannels(), []);
  const displayedChannels = useMemo(() => 
    showAllLogos ? requestedChannels : requestedChannels.slice(0, 24),
    [showAllLogos, requestedChannels]
  );

  return (
    <section className="w-full py-6 md:py-12 lg:py-16 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-3 md:px-6 max-w-7xl">
        
        {/* Hero Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-xs md:text-sm font-medium mb-4">
            <Tv className="w-3 h-3 md:w-4 md:h-4" />
            20,000+ Channels Available
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text px-2">
            Sample Channel Collection
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            This is just a sample of our extensive channel lineup. Our IPTV subscription includes more than 20,000+ channels from around the world. 
            All channels included in every subscription plan with no additional fees.
          </p>
        </div>

        {
        /* PREMIUM CHANNEL COLLECTION SHOWCASE */}
        
        <div className="mb-8 md:mb-16">
          {/* Channel Logos Grid */}
          <div className="relative">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
              {displayedChannels.map((channel, index) => (
                <div
                  key={`${channel.name}-${index}`}
                  className="group relative bg-white dark:bg-gray-900 rounded-lg md:rounded-xl p-2 md:p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 hover:scale-105"
                >
                  <div className="aspect-square flex items-center justify-center relative overflow-hidden rounded-md md:rounded-lg">
                    <OptimizedChannelImage
                      src={`/channel_guide/${channel.logo}`}
                      alt={channel.name}
                    />
                  </div>
                  
                  {/* Channel Name Tooltip - Hide on mobile, show on hover for larger screens */}
                  <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {channel.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            <div className="text-center px-4">
              <Button
                onClick={() => setShowAllLogos(!showAllLogos)}
                variant="outline"
                size="default"
                className="group border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm md:text-base px-4 md:px-6 py-2 md:py-3"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                {showAllLogos ? 'Show Less' : `View All Channels`}
                {showAllLogos ? (
                  <ChevronUp className="w-3 h-3 md:w-4 md:h-4 ml-2 group-hover:translate-y-[-2px] transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 ml-2 group-hover:translate-y-[2px] transition-transform duration-200" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
