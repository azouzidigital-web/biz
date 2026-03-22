"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CTAButton } from "./cta-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Home,
  Filter,
  Grid3X3,
  List,
  Play,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Eye
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
  "National Geographic": "logo_natgeo.webp",
  "Discovery": "logo_documentary_0.webp",
  "Animal Planet": "logo_wildtv.webp",
  "TLC": "logo_tlc.webp",
  "Crime + Investigation": "logo_crimeinvestigation.webp",
  
  // French Channels
  "Radio-Canada": "logo_iciradiocanada.webp",
  "TVA": "logo_tva.webp",
  "Noovo": "logo_noovo.webp",
  "Canal D": "logo_canald.webp",
  "Canal Vie": "logo_canalvie.webp",
  "ARTV": "logo_iciartv.webp",
  "Explora": "logo_iciexplora.webp",
  "RDI": "logo_icirdi.webp",
  "Z Télé": "logo_ztele.webp",
  "Historia": "logo_historia.webp",
  "Série+": "logo_seriesplus.webp",
  "UNIS TV": "logo_unis.webp",
  
  // International
  "APTN": "logo_aptn.webp",
  "OMNI.1": "logo_omni1.webp",
  "OMNI.2": "logo_omni2.webp",
  "Telelatino Network": "logo_tlc.webp",
  "AMI-tv": "logo_amitv.webp",
  "Vision TV": "logo_vision.webp"
};

// Get most popular/requested channels based on logos available
const getMostRequestedChannels = () => {
  const allChannels = [
    // CANADIAN NETWORKS
    { name: "CBC Television", logo: "logo_cbctelevision.webp", category: "Canadian" },
    { name: "Global TV", logo: "logo_global.webp", category: "Canadian" },
    { name: "CTV", logo: "logo_ctvhd.webp", category: "Canadian" },
    { name: "CTV Two", logo: "logo_ctvtwo.webp", category: "Canadian" },
    { name: "City TV", logo: "logo_citytv.webp", category: "Canadian" },
    { name: "Your TV", logo: "logo_yourtv.webp", category: "Canadian" },
    { name: "Yes TV", logo: "logo_yestv.webp", category: "Canadian" },
    { name: "TVO", logo: "logo_tvo.webp", category: "Canadian" },
    { name: "TFO", logo: "logo_tfo.webp", category: "Canadian" },
    
    // SPORTS NETWORKS
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
    { name: "Big Ten Network", logo: "logo_bigten.webp", category: "Sports" },
    { name: "Sportsman Channel", logo: "logo_sportsman.webp", category: "Sports" },
    
    // NEWS NETWORKS
    { name: "CBC News Network", logo: "logo_cbcnews.webp", category: "News" },
    { name: "CP24", logo: "logo_cp24.webp", category: "News" },
    { name: "CTV News Network", logo: "logo_ctvnewsnet.webp", category: "News" },
    { name: "BNN Bloomberg", logo: "logo_bnnbloomberg.webp", category: "News" },
    { name: "CPAC", logo: "logo_cpac.webp", category: "News" },
    { name: "CPAC English", logo: "logo_cpac_en.webp", category: "News" },
    { name: "RDI", logo: "logo_icirdi.webp", category: "News" },
    { name: "LCN", logo: "logo_lcn.webp", category: "News" },
    { name: "CNN International", logo: "logo_cnninternational.webp", category: "News" },
    { name: "CNN HLN", logo: "logo_cnn_hln.webp", category: "News" },
    { name: "Fox News", logo: "logo_foxnews.webp", category: "News" },
    { name: "MSNBC", logo: "logo_msnbc.webp", category: "News" },
    { name: "CNBC", logo: "logo_cnbc.webp", category: "News" },
    { name: "BBC News", logo: "logo_bbcnews.webp", category: "News" },
    { name: "France 24", logo: "logo_france24.webp", category: "News" },
    { name: "Al Jazeera", logo: "logo_aljazeera.webp", category: "News" },
    { name: "NBC", logo: "logo_nbc.webp", category: "News" },
    { name: "CBS", logo: "logo_cbs.webp", category: "News" },
    { name: "PBS", logo: "logo_pbs.webp", category: "News" },
    { name: "MétéoMédia", logo: "logo_meteomedia.webp", category: "News" },
    { name: "The Weather Network", logo: "logo_theweathernetwork.webp", category: "News" },
    { name: "News Forum", logo: "logo_newsforum.webp", category: "News" },
    
    // ENTERTAINMENT CHANNELS
    { name: "Showcase", logo: "logo_showcase.webp", category: "Entertainment" },
    { name: "CTV Comedy Channel", logo: "logo_ctvcomedy.webp", category: "Entertainment" },
    { name: "CTV Drama Channel", logo: "logo_ctvdrama.webp", category: "Entertainment" },
    { name: "CTV Sci-Fi Channel", logo: "logo_ctvscifi.webp", category: "Entertainment" },
    { name: "CTV Life Channel", logo: "logo_ctvlife.webp", category: "Entertainment" },
    { name: "W Network", logo: "logo_wnetwork.webp", category: "Entertainment" },
    { name: "Slice", logo: "logo_slice.webp", category: "Entertainment" },
    { name: "Lifetime", logo: "logo_lifetime.webp", category: "Entertainment" },
    { name: "Fox", logo: "logo_fox.webp", category: "Entertainment" },
    { name: "FX Canada", logo: "logo_fxcanada.webp", category: "Entertainment" },
    { name: "FXX", logo: "logo_fxx.webp", category: "Entertainment" },
    { name: "USA Network", logo: "logo_usanetwork.webp", category: "Entertainment" },
    { name: "A&E", logo: "logo_ae.webp", category: "Entertainment" },
    { name: "TLC", logo: "logo_tlc.webp", category: "Entertainment" },
    { name: "Oxygen", logo: "logo_oxygen.webp", category: "Entertainment" },
    { name: "Addik TV", logo: "logo_addik.webp", category: "Entertainment" },
    { name: "Déjà View", logo: "logo_dejaview.webp", category: "Entertainment" },
    { name: "Rewind", logo: "logo_rewind.webp", category: "Entertainment" },
    { name: "Silver Screen Classics", logo: "logo_silver_screen.webp", category: "Entertainment" },
    { name: "ABC", logo: "logo_abc.webp", category: "Entertainment" },
    { name: "ABC Spark", logo: "logo_abc_spark.webp", category: "Entertainment" },
    { name: "Évasion", logo: "logo_evasion.webp", category: "Entertainment" },
    { name: "Elle Fictions", logo: "logo_ellefictions.webp", category: "Entertainment" },
    { name: "Zeste", logo: "logo_zeste.webp", category: "Entertainment" },
    { name: "Z Télé", logo: "logo_ztele.webp", category: "Entertainment" },
    { name: "Noovo", logo: "logo_noovo.webp", category: "Entertainment" },
    { name: "TVA", logo: "logo_tva.webp", category: "Entertainment" },
    { name: "Séries+", logo: "logo_seriesplus.webp", category: "Entertainment" },
    { name: "Historia", logo: "logo_historia.webp", category: "Entertainment" },
    { name: "Canal D", logo: "logo_canald.webp", category: "Entertainment" },
    { name: "Canal Vie", logo: "logo_canalvie.webp", category: "Entertainment" },
    { name: "Casa", logo: "logo_casa.webp", category: "Entertainment" },
    { name: "TV5", logo: "logo_tv5.webp", category: "Entertainment" },
    { name: "RevTV", logo: "logo_revtv.webp", category: "Entertainment" },
    { name: "GSN", logo: "logo_gsn.webp", category: "Entertainment" },
    { name: "Game+", logo: "logo_gameplus.webp", category: "Entertainment" },
    { name: "OUTtv", logo: "logo_outtv.webp", category: "Entertainment" },
    { name: "One", logo: "logo_one.webp", category: "Entertainment" },
    { name: "MAX", logo: "logo_max.webp", category: "Entertainment" },
    
    // KIDS CHANNELS
    { name: "Disney Channel", logo: "logo_disneychannel.webp", category: "Kids" },
    { name: "Disney Junior", logo: "logo_disneyjr.webp", category: "Kids" },
    { name: "Disney XD", logo: "logo_disneyxd.webp", category: "Kids" },
    { name: "YTV", logo: "logo_ytv.webp", category: "Kids" },
    { name: "Treehouse", logo: "logo_treehouse.webp", category: "Kids" },
    { name: "Teletoon", logo: "logo_teletoon.webp", category: "Kids" },
    { name: "Cartoon Network", logo: "logo_cartoonnetwork.webp", category: "Kids" },
    { name: "Boomerang", logo: "logo_boomerang.webp", category: "Kids" },
    { name: "Nickelodeon", logo: "logo_nickel.webp", category: "Kids" },
    { name: "Toonami Vision", logo: "logo_toonavision.webp", category: "Kids" },
    { name: "WildBrain", logo: "logo_wildbrain.webp", category: "Kids" },
    
    // MOVIES & PREMIUM
    { name: "Super Channel Heart & Home", logo: "logo_super_channelhd1.webp", category: "Movies" },
    { name: "Super Channel Fuse", logo: "logo_super_channelhd2.webp", category: "Movies" },
    { name: "Super Channel Vault", logo: "logo_superchannel_vault.webp", category: "Movies" },
    { name: "Hollywood Suite", logo: "logo_hollywoodsuitenew.webp", category: "Movies" },
    { name: "Movie Network", logo: "logo_movietime.webp", category: "Movies" },
    { name: "CinéPop", logo: "logo_cinepop.webp", category: "Movies" },
    
    // MUSIC CHANNELS
    { name: "Much", logo: "logo_much.webp", category: "Music" },
    { name: "CMT", logo: "logo_cmt.webp", category: "Music" },
    { name: "Stingray Vibe", logo: "logo_stingrayvibe.webp", category: "Music" },
    { name: "Stingray Loud", logo: "logo_stingrayloud.webp", category: "Music" },
    { name: "Stingray Retro", logo: "logo_stingrayretro.webp", category: "Music" },
    { name: "Stingray Country", logo: "logo_stingraycountry.webp", category: "Music" },
    { name: "Stingray Classica", logo: "logo_stingrayclassica.webp", category: "Music" },
    { name: "Mezzo Live HD", logo: "logo_mezzolivehd.webp", category: "Music" },
    { name: "AXS TV", logo: "logo_axs.webp", category: "Music" },
    
    // LIFESTYLE CHANNELS
    { name: "HGTV", logo: "logo_homenetwork.webp", category: "Lifestyle" },
    { name: "Food Network", logo: "logo_flavour.webp", category: "Lifestyle" },
    { name: "Travel + Escape", logo: "logo_travelescape.webp", category: "Lifestyle" },
    { name: "Cottage Life", logo: "logo_cottagelife.webp", category: "Lifestyle" },
    { name: "Makeful", logo: "logo_makeful.webp", category: "Lifestyle" },
    { name: "Love Nature", logo: "logo_lovenature.webp", category: "Lifestyle" },
    { name: "Wild TV", logo: "logo_wildtv.webp", category: "Lifestyle" },
    { name: "CTV Wild", logo: "logo_ctvwild.webp", category: "Lifestyle" },
    { name: "CTV Nature", logo: "logo_ctvnature.webp", category: "Lifestyle" },
    { name: "CTV Speed", logo: "logo_ctvspeed.webp", category: "Lifestyle" },
    { name: "DTour", logo: "logo_dtour.webp", category: "Lifestyle" },
    { name: "Everything Entertainment", logo: "logo_everythingentertainment.webp", category: "Lifestyle" },
    { name: "Quest", logo: "logo_quest.webp", category: "Lifestyle" },
    
    // EDUCATION & DOCUMENTARY
    { name: "History", logo: "logo_history.webp", category: "Education" },
    { name: "H2", logo: "logo_h2.webp", category: "Education" },
    { name: "National Geographic", logo: "logo_natgeo.webp", category: "Education" },
    { name: "National Geographic Wild", logo: "logo_nationalgeo.webp", category: "Education" },
    { name: "Discovery Channel", logo: "logo_documentary_0.webp", category: "Education" },
    { name: "Smithsonian Channel", logo: "logo_smithsonian.webp", category: "Education" },
    { name: "American Heroes Channel", logo: "logo_ahc.webp", category: "Education" },
    { name: "Crime + Investigation", logo: "logo_crimeinvestigation.webp", category: "Education" },
    { name: "BBC Earth", logo: "logo_bbcearth2.webp", category: "Education" },
    { name: "ARTV", logo: "logo_iciartv.webp", category: "Education" },
    { name: "Explora", logo: "logo_iciexplora.webp", category: "Education" },
    { name: "Planète+", logo: "logo_planeteplus.webp", category: "Education" },
    
    // INTERNATIONAL & FRENCH
    { name: "Radio-Canada", logo: "logo_iciradiocanada.webp", category: "International" },
    { name: "BBC First", logo: "logo_bbcfirst.webp", category: "International" },
    { name: "OMNI.1", logo: "logo_omni1.webp", category: "International" },
    { name: "OMNI.2", logo: "logo_omni2.webp", category: "International" },
    { name: "OMNI East", logo: "logo_omnieast.webp", category: "International" },
    { name: "APTN", logo: "logo_aptn.webp", category: "International" },
    { name: "APTN Languages", logo: "logo_aptnl.webp", category: "International" },
    { name: "AMI-tv", logo: "logo_amitv.webp", category: "International" },
    { name: "AMI-télé", logo: "logo_amitele.webp", category: "International" },
    { name: "AMI-audio", logo: "logo_ami-audio.webp", category: "International" },
    { name: "Vision TV", logo: "logo_vision.webp", category: "International" },
    { name: "JLTV", logo: "logo_jltv.webp", category: "International" },
    { name: "UNIS TV", logo: "logo_unis.webp", category: "International" },
    { name: "TFN", logo: "logo_tfn.webp", category: "International" },
    { name: "UVAGUT TV", logo: "logo_uvagut.webp", category: "International" },
    
    // SHOPPING
    { name: "TSC", logo: "logo_tsc.webp", category: "Shopping" },
    
    // SPECIAL/MISC
    { name: "Fox Sports", logo: "fox_sports.webp", category: "Sports" },
    { name: "Legislative Assembly of Ontario", logo: "logo_legislative_assembly_ontario.webp", category: "Education" },
    { name: "Témoin", logo: "temoin.webp", category: "Education" }
  ];
  
  return allChannels;
};

const categories = [
  { id: "all", label: "All Channels", icon: Tv, count: "365+" },
  { id: "Canadian", label: "Canadian", icon: Heart, count: "28+" },
  { id: "Sports", label: "Sports", icon: Trophy, count: "68+" },
  { id: "Movies", label: "Movies", icon: Film, count: "20+" },
  { id: "News", label: "News", icon: Newspaper, count: "65+" },
  { id: "Entertainment", label: "Entertainment", icon: Star, count: "59+" },
  { id: "Kids", label: "Kids", icon: Baby, count: "27+" },
  { id: "Music", label: "Music", icon: Music, count: "29+" },
  { id: "Lifestyle", label: "Lifestyle", icon: Home, count: "9+" },
  { id: "Education", label: "Education", icon: Filter, count: "27+" },
  { id: "Ethnic", label: "Ethnic", icon: Globe, count: "12+" },
  { id: "Shopping", label: "Shopping", icon: CheckCircle, count: "1+" },
  { id: "International", label: "International", icon: Globe, count: "18+" }
];

// Channel name obfuscation utility
const obfuscateChannelName = (name: string, shouldObfuscate: boolean = false) => {
  if (!shouldObfuscate) return name;
  
  // Replace some characters with similar-looking Unicode characters
  const obfuscationMap: { [key: string]: string } = {
    'A': 'Α', // Greek Alpha
    'B': 'Β', // Greek Beta
    'E': 'Ε', // Greek Epsilon
    'H': 'Η', // Greek Eta
    'I': 'Ι', // Greek Iota
    'K': 'Κ', // Greek Kappa
    'M': 'Μ', // Greek Mu
    'N': 'Ν', // Greek Nu
    'O': 'Ο', // Greek Omicron
    'P': 'Ρ', // Greek Rho
    'T': 'Τ', // Greek Tau
    'X': 'Χ', // Greek Chi
    'Y': 'Υ', // Greek Upsilon
    'Z': 'Ζ'  // Greek Zeta
  };
  
  return name.split('').map(char => obfuscationMap[char.toUpperCase()] || char).join('');
};

// Simplified channel structure - just name and category
interface Channel {
  name: string;
  category: string;
  country: string;
  popular?: boolean;
  premium?: boolean;
  mediaType?: string;
  paid?: boolean;
  language?: string;
  platform?: string;
}

// Comprehensive channel list (sample of channels for demo)
const channels: Channel[] = [
  // Canadian News Channels
  { name: "CBC News Network", category: "News", country: "Canada", mediaType: "Video", paid: false, popular: true },
  { name: "Global News", category: "News", country: "Canada", mediaType: "Video", paid: false, popular: true },
  { name: "CP24", category: "News", country: "Canada", mediaType: "Video", paid: false, popular: true },
  { name: "CTV News Channel", category: "News", country: "Canada", mediaType: "Video", paid: false },
  
  // Canadian General/Entertainment
  { name: "CBC Television", category: "Canadian", country: "Canada", mediaType: "Video", paid: false, popular: true },
  { name: "CTV", category: "Canadian", country: "Canada", mediaType: "Video", paid: false, popular: true },
  { name: "Global TV", category: "Canadian", country: "Canada", mediaType: "Video", paid: false, popular: true },
  { name: "CTV Comedy Channel", category: "Entertainment", country: "Canada", mediaType: "Video", paid: false },
  { name: "CTV Sci-Fi Channel (Space)", category: "Entertainment", country: "Canada", mediaType: "Video", paid: false },
  
  // Canadian Sports
  { name: "TSN (The Sports Network)", category: "Sports", country: "Canada", mediaType: "Video", paid: true, premium: true, popular: true },
  { name: "TSN2", category: "Sports", country: "Canada", mediaType: "Video", paid: true, premium: true, popular: true },
  { name: "Sportsnet", category: "Sports", country: "Canada", mediaType: "Video", paid: true, premium: true, popular: true },
  { name: "Sportsnet One", category: "Sports", country: "Canada", mediaType: "Video", paid: true, premium: true },
  { name: "Sportsnet 360", category: "Sports", country: "Canada", mediaType: "Video", paid: true, premium: true },
  
  // US Sports
  { name: "ESPN", category: "Sports", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "ESPN2", category: "Sports", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "Fox Sports 1", category: "Sports", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "Fox Sports 2", category: "Sports", country: "USA", mediaType: "Video", paid: true },
  { name: "NBC Sports Network", category: "Sports", country: "USA", mediaType: "Video", paid: true },
  { name: "CBS Sports Network", category: "Sports", country: "USA", mediaType: "Video", paid: true },
  { name: "NBA TV", category: "Sports", country: "USA", mediaType: "Video", paid: true, premium: true },
  
  // US News Channels
  { name: "CNN", category: "News", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "Fox News", category: "News", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "MSNBC", category: "News", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "NBC News Now", category: "News", country: "USA", mediaType: "Video", paid: false },
  { name: "CBSN", category: "News", country: "USA", mediaType: "Video", paid: false },
  { name: "ABC News Live", category: "News", country: "USA", mediaType: "Video", paid: false },
  
  // Entertainment Channels
  { name: "Showcase", category: "Entertainment", country: "Canada" },
  { name: "Discovery Canada", category: "Entertainment", country: "Canada", popular: true },
  { name: "National Geographic Canada", category: "Entertainment", country: "Canada" },
  { name: "History Channel Canada", category: "Entertainment", country: "Canada" },
  { name: "W Network", category: "Entertainment", country: "Canada" },
  { name: "Slice", category: "Entertainment", country: "Canada" },
  { name: "USA Network", category: "Entertainment", country: "USA" },
  { name: "Lifetime", category: "Entertainment", country: "USA" },
  { name: "A&E", category: "Entertainment", country: "USA" },
  { name: "TLC", category: "Entertainment", country: "USA" },
  
  // Kids Channels
  { name: "YTV", category: "Kids", country: "Canada", popular: true },
  { name: "Teletoon", category: "Kids", country: "Canada", popular: true },
  { name: "Treehouse TV", category: "Kids", country: "Canada" },
  { name: "Family Channel", category: "Kids", country: "Canada", popular: true },
  { name: "Cartoon Network", category: "Kids", country: "Canada", popular: true },
  { name: "Disney Channel", category: "Kids", country: "USA", popular: true },
  { name: "Disney Junior", category: "Kids", country: "USA", popular: true },
  { name: "Disney XD", category: "Kids", country: "USA" },
  { name: "Nickelodeon", category: "Kids", country: "USA", popular: true },
  { name: "PBS Kids", category: "Kids", country: "USA" },
  
  // Music Channels
  { name: "Much", category: "Music", country: "Canada", popular: true },
  { name: "MTV", category: "Music", country: "USA", popular: true },
  { name: "MTV2", category: "Music", country: "USA" },
  { name: "VH1", category: "Music", country: "USA" },
  { name: "CMT", category: "Music", country: "USA" },
  
  // Movies
  { name: "Crave", category: "Movies", country: "Canada", popular: true, premium: true },
  { name: "HBO Canada", category: "Movies", country: "Canada", premium: true },
  { name: "Showtime", category: "Movies", country: "Canada", premium: true },
  { name: "Super Channel Fuse", category: "Movies", country: "Canada", premium: true },
  { name: "The Movie Network", category: "Movies", country: "Canada", premium: true },
  { name: "FX", category: "Movies", country: "USA" },
  { name: "TNT", category: "Movies", country: "USA" },
  { name: "AMC", category: "Movies", country: "USA" },
  
  // Lifestyle Channels
  { name: "HGTV Canada", category: "Lifestyle", country: "Canada", popular: true },
  { name: "Food Network Canada", category: "Lifestyle", country: "Canada", popular: true },
  { name: "HGTV", category: "Lifestyle", country: "USA" },
  { name: "Food Network", category: "Lifestyle", country: "USA" },
  
  // Education Channels
  { name: "TVO (Ontario)", category: "Education", country: "Canada", mediaType: "Video", paid: false },
  { name: "Knowledge Network (BC)", category: "Education", country: "Canada", mediaType: "Video", paid: false },
  { name: "Discovery Channel", category: "Education", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "History Channel", category: "Education", country: "USA", mediaType: "Video", paid: true },
  { name: "National Geographic", category: "Education", country: "USA", mediaType: "Video", paid: true, popular: true },
  { name: "PBS", category: "Education", country: "USA", mediaType: "Video", paid: false },
  
  // International Channels
  { name: "TV5 Monde", category: "International", country: "France" },
  { name: "BBC World News", category: "International", country: "UK", popular: true },
  { name: "BBC News", category: "International", country: "UK", popular: true },
  { name: "Al Jazeera English", category: "International", country: "Qatar" },
  { name: "France 24", category: "International", country: "France" },
  { name: "Deutsche Welle", category: "International", country: "Germany" },
  { name: "NHK World", category: "International", country: "Japan" },
  { name: "Euronews", category: "International", country: "Europe" },
  
  // Ethnic Channels
  { name: "APTN", category: "Ethnic", country: "Canada" },
  { name: "OMNI.1", category: "Ethnic", country: "Canada" },
  { name: "OMNI.2", category: "Ethnic", country: "Canada" },
  { name: "Vision TV", category: "Ethnic", country: "Canada" },
  
  // Shopping
  { name: "QVC", category: "Shopping", country: "USA", mediaType: "Video", language: "English", platform: "M3U" },
];

export function ChannelsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllLogos, setShowAllLogos] = useState(false);
  const [scrambleText, setScrambleText] = useState(false);

  // Get channels data
  const requestedChannels = getMostRequestedChannels();
  const displayedChannels = showAllLogos ? requestedChannels : requestedChannels.slice(0, 48); // Show more initially

  useEffect(() => {
    // Anti-scraping text scrambling
    const scrambleInterval = setInterval(() => {
      setScrambleText(prev => !prev);
    }, 30000);

    return () => clearInterval(scrambleInterval);
  }, []);

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || channel.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getChannelsToShow = () => {
    if (selectedCategory === "all") {
      return searchTerm ? filteredChannels : channels.slice(0, 50);
    }
    return filteredChannels;
  };

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

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Hero Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Tv className="w-4 h-4" />
            140+ Premium Channels Available
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Complete Channel Lineup
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore our curated collection of 140+ premium channels from major Canadian and international broadcasters. 
            All channels included in every subscription plan with no additional fees.
          </p>
          
          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full text-base border-2 border-border/50 focus:border-primary rounded-xl shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 bg-card border border-border/50 rounded-xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-lg"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { number: "140+", label: "Total Channels", icon: Tv, color: "bg-blue-500" },
            { number: "35+", label: "Canadian Channels", icon: Heart, color: "bg-red-500" },
            { number: "13", label: "Categories", icon: Globe, color: "bg-green-500" },
            { number: "4K", label: "Ultra HD Quality", icon: Zap, color: "bg-purple-500" }
          ].map((stat, index) => (
            <Card key={index} className="relative overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MOST REQUESTED CHANNELS SHOWCASE */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Most Requested Channels
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Premium Channel Collection
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
                  <div className="text-2xl font-bold text-red-600 mb-1">35+</div>
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
        {/* END MOST REQUESTED CHANNELS SHOWCASE */}

        {/* Channel Filter and Listings - Existing Tabs Section */}
        <Tabs defaultValue="all" className="w-full" value={selectedCategory} onValueChange={setSelectedCategory}>
          {/* Category Tabs */}
          <div className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2 h-auto bg-card/50 p-2 rounded-2xl border border-border/50">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className={`flex flex-col gap-2 py-4 px-3 text-xs font-medium rounded-xl transition-all duration-300 
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                        : 'hover:bg-accent/50 hover:text-accent-foreground'
                      }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="hidden sm:inline leading-tight">{category.label}</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-background/50">
                      {searchTerm && selectedCategory === category.id ? filteredChannels.length : category.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Channel Content for each category */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {category.label}
                      </h2>
                      <p className="text-muted-foreground">
                        {searchTerm ? `${filteredChannels.length} channels found` : `${category.count} channels available`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Channel Display */}
                {getChannelsToShow().length > 0 ? (
                  <>
                    {viewMode === "grid" ? (
                      /* Grid View */
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {getChannelsToShow().map((channel, index) => (
                          <Card key={`${channel.name}-${index}`} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm" data-channel={index}>
                            <CardContent className="p-4" data-protected="true">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                                    <Tv className="w-4 h-4 text-primary" />
                                  </div>
                                  {channel.popular && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                {channel.premium && (
                                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300">
                                    HD
                                  </Badge>
                                )}
                              </div>
                              
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {obfuscateChannelName(channel.name, scrambleText)}
                              </h3>
                              
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs px-2 py-1 ${getCategoryColor(channel.category)}`}
                                >
                                  {channel.country}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      /* List View */
                      <div className="space-y-2">
                        {getChannelsToShow().map((channel, index) => (
                          <Card key={`${channel.name}-${index}`} className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30" data-channel={index}>
                            <CardContent className="p-4" data-protected="true">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Tv className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base mb-1 truncate group-hover:text-primary transition-colors">
                                      {obfuscateChannelName(channel.name, scrambleText)}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs px-2 py-0.5 ${getCategoryColor(channel.category)}`}
                                      >
                                        {channel.country}
                                      </Badge>
                                      {channel.popular && (
                                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border-yellow-200">
                                          <Star className="w-3 h-3 mr-1 fill-current" />
                                          Popular
                                        </Badge>
                                      )}
                                      {channel.premium && (
                                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 border-purple-200">
                                          <Zap className="w-3 h-3 mr-1" />
                                          HD
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* No Results */
                  <Card className="border-dashed border-2 border-border/50">
                    <CardContent className="py-12 text-center">
                      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">No channels found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or browse other categories
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Show more info for "All" category */}
                {selectedCategory === "all" && !searchTerm && (
                  <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Complete Channel Access</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Showing our complete lineup of <strong>140+ premium channels</strong> from around the world.
                        Use the category tabs above to explore specific channel types.
                      </p>
                      <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                        <Filter className="w-4 h-4 mr-2" />
                        Browse Categories
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Enhanced CTA Section */}
        <div className="mt-16">
          <Card className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/80 border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <CardContent className="relative p-8 md:p-12 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <CheckCircle className="w-4 h-4" />
                  All Channels Included
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Ready to Access All These Channels?
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  Get instant access to our complete channel lineup with any subscription plan. 
                  All 140+ premium channels included, no tiered pricing or hidden fees.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
                  <CTAButton 
                    text="Start Streaming Now 📺" 
                    className="font-bold bg-white text-primary hover:bg-white/90 hover:text-primary/90 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    href="/#yearly-plan"
                  />
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    30-day money-back guarantee
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    No contract required
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Instant activation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
