"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, Grid3X3, List, Search, X, Globe, Layout } from "lucide-react";

type Style = "V1" | "V2" | "V3" | "V4" | "V5";
type PageType = "single" | "multi";
type TopTab = "templates" | "current";

interface Site {
  name: string;
  industry: string;
  url: string;
  style: Style;
  colors: [string, string];
  font: string;
  description: string;
  pages: PageType;
  features: string[];
}

interface HostedSite {
  name: string;
  industry: string;
  url: string;
  platform: "WordPress" | "Next.js" | "Custom";
  colors: [string, string];
}

const hostedSites: HostedSite[] = [
  { name: "All About Drains", industry: "Drain Service", url: "https://allaboutdrainsaz.com", platform: "WordPress", colors: ["#2563EB", "#1E40AF"] },
  { name: "All Mountain Systems", industry: "IT Systems", url: "https://allmountainsystems.com", platform: "WordPress", colors: ["#0F766E", "#134E4A"] },
  { name: "NZ Barber", industry: "Barbershop", url: "https://app.nzbarber.com", platform: "WordPress", colors: ["#D4A017", "#1C1C1C"] },
  { name: "Cowboy Plumbing", industry: "Plumbing", url: "https://cowboyplumbingaz.com", platform: "WordPress", colors: ["#92400E", "#451A03"] },
  { name: "Gadget Geeks", industry: "Electronics Repair", url: "https://fix.gadgetgeeks.com", platform: "WordPress", colors: ["#39FF14", "#B026FF"] },
  { name: "GuestQuest", industry: "Hospitality App", url: "https://guestquest.app", platform: "Custom", colors: ["#6366F1", "#4F46E5"] },
  { name: "Happy Carousel Daycare", industry: "Daycare", url: "https://happycarouselkids.com", platform: "WordPress", colors: ["#F472B6", "#A855F7"] },
  { name: "Hero Breakfast", industry: "Restaurant", url: "https://herobreakfast.com", platform: "WordPress", colors: ["#DC2626", "#F59E0B"] },
  { name: "iDoRecruit", industry: "Recruiting", url: "https://idorecruit.com", platform: "WordPress", colors: ["#2563EB", "#06B6D4"] },
  { name: "Jackrabbit Plumbing & Gas", industry: "Plumbing & Gas", url: "https://jackrabbitplumbingfw.com", platform: "WordPress", colors: ["#EA580C", "#16A34A"] },
  { name: "Kingdom Recovery Roofing", industry: "Roofing", url: "https://kingdomrecoveryroofing.com", platform: "WordPress", colors: ["#7C3AED", "#D4A017"] },
  { name: "Raycrete LLC", industry: "Concrete", url: "https://raycretellc.com", platform: "WordPress", colors: ["#78716C", "#44403C"] },
  { name: "Service Official", industry: "SaaS Platform", url: "https://serviceofficial.app", platform: "Custom", colors: ["#D77E00", "#00B4D8"] },
  { name: "Sigma Player Cards", industry: "Trading Cards", url: "https://sigmaplayercards.com", platform: "WordPress", colors: ["#EAB308", "#1C1917"] },
  { name: "Tap Official", industry: "SaaS Platform", url: "https://tapofficial.com", platform: "Custom", colors: ["#D77E00", "#14B8A6"] },
  { name: "The Horseshoe", industry: "Bar & Restaurant", url: "https://thehorseshoebenson.com", platform: "WordPress", colors: ["#92400E", "#78350F"] },
  { name: "The Plumber Kings", industry: "Plumbing", url: "https://theplumberkings.com", platform: "WordPress", colors: ["#1D4ED8", "#FBBF24"] },
  { name: "On The Spot Locksmith", industry: "Locksmith", url: "https://tucsonlocksmithnow.com", platform: "WordPress", colors: ["#DC2626", "#1C1917"] },
];

const sites: Site[] = [
  { name: "Catalina Garage", industry: "Auto Repair", url: "https://catalina-garage.vercel.app", style: "V1", colors: ["#C0392B", "#45B5AA"], font: "Bricolage Grotesque", description: "Retro halftone dots, cherry & turquoise", pages: "multi", features: ["halftone", "marquee", "scroll-reveal"] },
  { name: "Copper Creek Plumbing", industry: "Plumbing", url: "https://copper-creek-plumbing.vercel.app", style: "V1", colors: ["#2E6F9E", "#C47A3A"], font: "Bricolage Grotesque", description: "Water ripple animations, steel blue & copper", pages: "multi", features: ["svg-filter", "marquee", "scroll-reveal"] },
  { name: "Dark Sky Coffee", industry: "Coffee Shop", url: "https://dark-sky-coffee.vercel.app", style: "V1", colors: ["#1E3A5F", "#D4A43C"], font: "Bricolage Grotesque", description: "Astronomy starfield, midnight & gold", pages: "multi", features: ["starfield", "marquee", "scroll-reveal"] },
  { name: "Ironwood Landscaping", industry: "Landscaping", url: "https://ironwood-landscaping.vercel.app", style: "V1", colors: ["#3D6B4E", "#C4915E"], font: "Bricolage Grotesque", description: "Desert foliage, sage & terracotta, real photos", pages: "multi", features: ["svg-noise", "marquee", "scroll-reveal", "real-photos"] },
  { name: "Platinum Pool Service", industry: "Pool Service", url: "https://platinum-pool-service.vercel.app", style: "V1", colors: ["#1E5BA8", "#5BA7DB"], font: "Bricolage Grotesque", description: "Pool caustics, marine blue + brand page", pages: "multi", features: ["svg-filter", "brand-page", "marquee"] },
  { name: "Slab & Grain Flooring", industry: "Flooring", url: "https://slab-and-grain-flooring.vercel.app", style: "V1", colors: ["#6B4226", "#D4A44C"], font: "Bricolage Grotesque", description: "Wood grain texture, walnut & honey", pages: "multi", features: ["svg-noise", "marquee", "scroll-reveal"] },
  { name: "Bark & Bloom Pet Spa", industry: "Dog Grooming", url: "https://bark-and-bloom-grooming.vercel.app", style: "V1", colors: ["#FF6B6B", "#4ECDC4"], font: "Bricolage Grotesque", description: "Floating paw prints, coral & mint, mobile grooming", pages: "multi", features: ["particle-animation", "marquee", "scroll-reveal"] },
  { name: "Digital Official", industry: "Marketing Agency", url: "https://the-digital-official.vercel.app", style: "V1", colors: ["#D77E00", "#00B4D8"], font: "Bricolage Grotesque", description: "Geometric grid, dark agency theme", pages: "multi", features: ["grid-pattern", "marquee", "counters"] },
  { name: "Gadget Geeks Plus", industry: "Electronics", url: "https://gadget-geeks-plus.vercel.app", style: "V1", colors: ["#39FF14", "#B026FF"], font: "Bricolage Grotesque", description: "Circuit board neon, repair + buy/sell/trade", pages: "multi", features: ["circuit-pattern", "split-nav", "marquee"] },
  { name: "Tiny Explorers Academy", industry: "Daycare", url: "https://tiny-explorers-academy.vercel.app", style: "V1", colors: ["#4FC3F7", "#F06292"], font: "Fredoka", description: "Rainbow shapes, crayon dividers, playful", pages: "multi", features: ["floating-shapes", "rainbow-dividers", "marquee"] },
  { name: "Ink & Iron Studio", industry: "Tattoo & Piercing", url: "https://ink-and-iron-studio-v2.vercel.app", style: "V2", colors: ["#C41E3A", "#C9A96E"], font: "Playfair Display", description: "Dark editorial, noise grain, horizontal scroll portfolio", pages: "single", features: ["noise-grain", "horizontal-scroll", "bento-grid", "real-photos"] },
  { name: "The Fade Room", industry: "Barbershop", url: "https://the-fade-room-v2.vercel.app", style: "V2", colors: ["#D4A017", "#1C1C1C"], font: "Space Grotesk", description: "Luxury barber, stacked type, gold accents", pages: "single", features: ["scroll-snap", "barber-stripe", "bento-grid"] },
  { name: "Fuego Street Kitchen", industry: "Food Truck", url: "https://fuego-street-kitchen-v2.vercel.app", style: "V2", colors: ["#FF5722", "#AACC00"], font: "Archivo Black", description: "Bold street culture, angled dividers", pages: "single", features: ["angled-dividers", "bento-grid", "menu-ticker"] },
  { name: "Grit Athletics", industry: "Fitness / Gym", url: "https://grit-athletics-v2.vercel.app", style: "V2", colors: ["#E8FF00", "#000000"], font: "Bebas Neue", description: "Brutalist industrial, signal yellow", pages: "single", features: ["brutalist", "massive-type", "counters"] },
  { name: "Spotless Co.", industry: "Cleaning Service", url: "https://spotless-co-v2.vercel.app", style: "V2", colors: ["#00C853", "#E8F5E9"], font: "Outfit", description: "Ultra-clean, floating bubbles, mint", pages: "multi", features: ["floating-bubbles", "light-theme", "scroll-reveal"] },
  { name: "Arctic Air Pros", industry: "HVAC / AC", url: "https://arctic-air-pros-v2.vercel.app", style: "V2", colors: ["#00BCD4", "#0B1426"], font: "Sora", description: "Cool tech, ice crystal hex, dark navy", pages: "multi", features: ["hex-pattern", "dashboard-stats", "scroll-reveal"] },
  { name: "Shutter & Light", industry: "Photography", url: "https://shutter-and-light-v2.vercel.app", style: "V2", colors: ["#C5A55A", "#000000"], font: "Cormorant Garamond", description: "Editorial gallery, masonry, cinematic reveals", pages: "multi", features: ["masonry-grid", "cinematic-reveals", "portfolio"] },
  { name: "Summit Roofing Co.", industry: "Roofing", url: "https://summit-roofing-v2.vercel.app", style: "V2", colors: ["#B87333", "#1B2432"], font: "Lexend", description: "Roof-peak dividers, blueprint pattern, copper", pages: "multi", features: ["clip-path-dividers", "blueprint-pattern", "badges"] },
  { name: "Petal & Vine", industry: "Flower Shop", url: "https://petal-and-vine-v3.vercel.app", style: "V3", colors: ["#FF6B9D", "#C4B5FD"], font: "Plus Jakarta Sans", description: "Glassmorphism, rose pink mesh gradients", pages: "single", features: ["glassmorphism", "mesh-gradient", "glow-borders", "real-photos"] },
  { name: "Sugar & Bloom Bakery", industry: "Bakery", url: "https://sugar-and-bloom-bakery-v3.vercel.app", style: "V3", colors: ["#FF85A2", "#F5D5A0"], font: "Quicksand", description: "3D spinning cake (Three.js), glass cards", pages: "single", features: ["three-js", "glassmorphism", "3d-model"] },
  { name: "The Wax Lounge", industry: "Esthetics", url: "https://the-wax-lounge-v3.vercel.app", style: "V3", colors: ["#D4AF37", "#E8A0BF"], font: "Manrope", description: "Champagne gold, spinning glow borders", pages: "single", features: ["glassmorphism", "glow-borders", "pricing-table"] },
  { name: "Drift Wellness", industry: "Med Spa", url: "https://drift-wellness-v3.vercel.app", style: "V3", colors: ["#5EEAD4", "#A78BFA"], font: "DM Sans", description: "Teal & violet glassmorphism, holographic cards", pages: "single", features: ["glassmorphism", "holo-cards", "mesh-gradient"] },
  { name: "Canopy Tree Service", industry: "Tree Service", url: "https://canopy-tree-service-v4.vercel.app", style: "V4", colors: ["#4ADE80", "#0A120A"], font: "Space Grotesk", description: "IO scroll animations, holo cards, forest green", pages: "single", features: ["intersection-observer", "holo-cards", "magnetic-buttons"] },
  { name: "Lucky Paws Vet", industry: "Veterinary", url: "https://lucky-paws-vet-v4.vercel.app", style: "V4", colors: ["#F59E0B", "#FB7185"], font: "Nunito", description: "Word reveals, warm amber, friendly", pages: "single", features: ["word-reveal", "intersection-observer", "scroll-fade"] },
  { name: "Iron & Oak Furniture", industry: "Custom Furniture", url: "https://iron-and-oak-furniture-v4.vercel.app", style: "V4", colors: ["#D97706", "#94A3B8"], font: "Playfair Display", description: "Framer Motion, copper artisan, drag portfolio", pages: "single", features: ["framer-motion", "horizontal-scroll", "word-reveal", "real-photos"] },
  { name: "Midnight Auto Detail", industry: "Car Detailing", url: "https://midnight-auto-detail-v4.vercel.app", style: "V4", colors: ["#C0C0C0", "#1E3A5F"], font: "Montserrat", description: "Chrome metallic text, premium true black", pages: "single", features: ["chrome-text", "holo-cards", "magnetic-buttons"] },
  { name: "The Juice Standard", industry: "Juice Bar", url: "https://the-juice-standard-v4.vercel.app", style: "V4", colors: ["#BFFF00", "#FF9500"], font: "Urbanist", description: "Lime energy, citrus glow, organic", pages: "single", features: ["holo-cards", "intersection-observer", "scroll-fade"] },
  { name: "Ember & Stone Pizza", industry: "Pizzeria", url: "https://ember-and-stone-pizza-v4.vercel.app", style: "V4", colors: ["#E8590C", "#78716C"], font: "Bitter", description: "Wood-fired, warm ember serif", pages: "single", features: ["word-reveal", "intersection-observer", "real-photos"] },
  { name: "Blooming Nails Studio", industry: "Nail Salon", url: "https://blooming-nails-studio-v4.vercel.app", style: "V4", colors: ["#EC4899", "#C084FC"], font: "Poppins", description: "Hot pink/lilac, nail art gallery", pages: "single", features: ["intersection-observer", "gallery", "real-photos"] },
  { name: "Atlas Moving Co.", industry: "Moving Company", url: "https://atlas-moving-v4.vercel.app", style: "V4", colors: ["#2563EB", "#F97316"], font: "Lexend", description: "Bold blue/orange, strong & reliable", pages: "single", features: ["holo-cards", "intersection-observer", "real-photos"] },
  { name: "Tucson Twinkle", industry: "Holiday Lights", url: "https://tucson-twinkle-v4.vercel.app", style: "V4", colors: ["#FFD700", "#DC2626"], font: "Quicksand", description: "SVG house with scroll-activated lights", pages: "single", features: ["svg-animation", "scroll-driven-lights", "custom-illustration"] },
  // V5 sites
  { name: "Sonoran Realty Group", industry: "Luxury Real Estate", url: "https://sonoran-realty-group-v5.vercel.app", style: "V5", colors: ["#B8860B", "#FAFAF5"], font: "Cormorant Garamond", description: "Video hero, luxury serif, gold accents", pages: "single", features: ["video-hero", "framer-motion", "parallax", "real-photos"] },
  { name: "Desert Key Homes", industry: "Residential Real Estate", url: "https://desert-key-homes-v5.vercel.app", style: "V5", colors: ["#0EA5E9", "#F5F1EB"], font: "Outfit", description: "Property search, neighborhood carousel", pages: "single", features: ["framer-motion", "search-bar", "carousel", "real-photos"] },
  { name: "Cactus Commercial", industry: "Commercial Real Estate", url: "https://cactus-commercial-v5.vercel.app", style: "V5", colors: ["#10B981", "#0C0F14"], font: "Sora", description: "Dark corporate, animated market stats", pages: "single", features: ["framer-motion", "animated-counters", "data-driven"] },
  { name: "Kush & Co.", industry: "Dispensary", url: "https://kush-and-co-v5.vercel.app", style: "V5", colors: ["#84CC16", "#0A1A0A"], font: "Space Grotesk", description: "Upscale dispensary, forest green/lime", pages: "single", features: ["framer-motion", "product-cards", "strain-badges"] },
  { name: "Precision Coat Painting", industry: "Paint Company", url: "https://precision-coat-painting-v5.vercel.app", style: "V5", colors: ["#3B82F6", "#FFFFFF"], font: "Lexend", description: "Light theme, blue accents, clean", pages: "single", features: ["framer-motion", "parallax", "real-photos"] },
  { name: "Keystone Property Mgmt", industry: "Property Management", url: "https://keystone-property-mgmt-v5.vercel.app", style: "V5", colors: ["#0D9488", "#0F172A"], font: "DM Sans", description: "Dark teal, professional, stats dashboard", pages: "single", features: ["framer-motion", "stats-bar", "checklist"] },
  { name: "StayCasa", industry: "Airbnb Management", url: "https://staycasa-v5.vercel.app", style: "V5", colors: ["#F97316", "#FFFFFF"], font: "Quicksand", description: "Revenue calculator, warm orange, friendly", pages: "single", features: ["framer-motion", "calculator", "real-photos"] },
  { name: "Ledger & Co.", industry: "Bookkeeping", url: "https://ledger-and-co-v5.vercel.app", style: "V5", colors: ["#059669", "#0C0F1A"], font: "Outfit", description: "Dark emerald/gold, trust-focused", pages: "single", features: ["framer-motion", "trust-pillars", "real-photos"] },
  { name: "The Humidor Lounge", industry: "Cigar Shop", url: "https://the-humidor-lounge-v5.vercel.app", style: "V5", colors: ["#B45309", "#1A1008"], font: "Playfair Display", description: "Dark walnut luxury, membership tiers", pages: "single", features: ["framer-motion", "membership-cards", "luxury-serif"] },
  { name: "Happy Hands Massage", industry: "Massage Therapy", url: "https://happy-hands-massage-v5.vercel.app", style: "V5", colors: ["#6B8E6B", "#FAFAF8"], font: "Quicksand", description: "Zen sage green, pricing packages", pages: "single", features: ["framer-motion", "pricing-cards", "light-theme"] },
  { name: "Volt Electric Co.", industry: "Electrician", url: "https://volt-electric-v5.vercel.app", style: "V5", colors: ["#FBBF24", "#0A0E1A"], font: "Lexend", description: "Electric yellow, 24/7 emergency banner", pages: "single", features: ["framer-motion", "emergency-banner", "process-steps"] },
  { name: "Rhythm Dance Studio", industry: "Dance Studio", url: "https://rhythm-dance-studio-v5.vercel.app", style: "V5", colors: ["#EC4899", "#1A0A2E"], font: "Poppins", description: "Purple/pink energy, class schedule", pages: "single", features: ["framer-motion", "schedule-grid", "instructor-cards"] },
  { name: "Flip City Gymnastics", industry: "Gymnastics Academy", url: "https://flip-city-gymnastics-v5.vercel.app", style: "V5", colors: ["#2563EB", "#DC2626"], font: "Montserrat", description: "Athletic red/blue, USA Gymnastics", pages: "single", features: ["framer-motion", "coach-profiles", "competition-schedule"] },
  { name: "Bayou Bites", industry: "Cajun Food Truck", url: "https://bayou-bites-v5.vercel.app", style: "V5", colors: ["#B91C1C", "#D4A43C"], font: "Archivo Black", description: "Cajun red/gold, spice level indicators", pages: "single", features: ["framer-motion", "menu-cards", "weekly-schedule"] },
  { name: "Mac-O-Roni", industry: "Mac & Cheese Truck", url: "https://mac-o-roni-v5.vercel.app", style: "V5", colors: ["#FCD34D", "#F97316"], font: "Fredoka", description: "Fun yellow/orange, toppings bar", pages: "single", features: ["framer-motion", "playful-hover", "menu-cards", "light-theme"] },
];

const styleBadge = (s: Style) =>
  s === "V1" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" :
  s === "V2" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" :
  s === "V3" ? "bg-purple-500/15 text-purple-400 border-purple-500/20" :
  s === "V4" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
  "bg-rose-500/15 text-rose-400 border-rose-500/20";

const allIndustries = [...new Set(sites.map(s => s.industry))].sort();
const allFeatures = [...new Set(sites.flatMap(s => s.features))].sort();

const platformBadge = (p: string) =>
  p === "WordPress" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" :
  p === "Next.js" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
  "bg-purple-500/15 text-purple-400 border-purple-500/20";

export default function Library() {
  const [topTab, setTopTab] = useState<TopTab>("templates");
  const [styleFilter, setStyleFilter] = useState<Style | "All">("All");
  const [pageFilter, setPageFilter] = useState<PageType | "All">("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [featureFilter, setFeatureFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [hostedSearch, setHostedSearch] = useState("");

  const filteredHosted = useMemo(() => {
    return hostedSites.filter(s => {
      if (hostedSearch && !s.name.toLowerCase().includes(hostedSearch.toLowerCase()) && !s.industry.toLowerCase().includes(hostedSearch.toLowerCase())) return false;
      return true;
    });
  }, [hostedSearch]);

  const filtered = useMemo(() => {
    return sites.filter(s => {
      if (styleFilter !== "All" && s.style !== styleFilter) return false;
      if (pageFilter !== "All" && s.pages !== pageFilter) return false;
      if (industryFilter !== "All" && s.industry !== industryFilter) return false;
      if (featureFilter !== "All" && !s.features.includes(featureFilter)) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.industry.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [styleFilter, pageFilter, industryFilter, featureFilter, search]);

  const counts = { V1: sites.filter(s => s.style === "V1").length, V2: sites.filter(s => s.style === "V2").length, V3: sites.filter(s => s.style === "V3").length, V4: sites.filter(s => s.style === "V4").length, V5: sites.filter(s => s.style === "V5").length };

  return (
    <div className="min-h-[100dvh] bg-[#08080C] text-[#F0F0F2]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#08080C]/80 backdrop-blur-xl border-b border-white/[.06]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-bold text-lg"><span className="text-[#D77E00]">Digital Official</span> <span className="text-[#888] font-normal text-sm">Site Library</span></h1>
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={() => setTopTab("templates")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${topTab === "templates" ? "bg-[#D77E00] text-white shadow-lg shadow-[#D77E00]/20" : "bg-white/[.06] text-[#888] hover:text-white hover:bg-white/[.1] border border-white/[.06]"}`}
                >
                  <Layout className="h-4 w-4" />
                  Templates
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${topTab === "templates" ? "bg-white/20 text-white" : "bg-white/[.06] text-[#666]"}`}>{sites.length}</span>
                </button>
                <button
                  onClick={() => setTopTab("current")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${topTab === "current" ? "bg-[#D77E00] text-white shadow-lg shadow-[#D77E00]/20" : "bg-white/[.06] text-[#888] hover:text-white hover:bg-white/[.1] border border-white/[.06]"}`}
                >
                  <Globe className="h-4 w-4" />
                  Current Sites
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${topTab === "current" ? "bg-white/20 text-white" : "bg-white/[.06] text-[#666]"}`}>{hostedSites.length}</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#888]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={topTab === "templates" ? search : hostedSearch}
                  onChange={e => topTab === "templates" ? setSearch(e.target.value) : setHostedSearch(e.target.value)}
                  className="pl-8 pr-7 py-1.5 rounded-lg bg-white/[.04] border border-white/[.08] text-xs text-white w-36 sm:w-48 focus:outline-none focus:border-[#D77E00]/40"
                />
                {(topTab === "templates" ? search : hostedSearch) && <button onClick={() => topTab === "templates" ? setSearch("") : setHostedSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2"><X className="h-3 w-3 text-[#888]" /></button>}
              </div>
              {/* View toggle */}
              <div className="flex items-center gap-0.5 bg-white/[.04] border border-white/[.08] rounded-lg p-0.5">
                <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-white/10 text-[#D77E00]" : "text-[#888]"}`}><Grid3X3 className="h-3.5 w-3.5" /></button>
                <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-white/10 text-[#D77E00]" : "text-[#888]"}`}><List className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>

          {/* Filter row — templates only */}
          {topTab === "templates" && (
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {/* Style */}
            <div className="flex items-center gap-0.5">
              {(["All", "V1", "V2", "V3", "V4", "V5"] as const).map(v => (
                <button key={v} onClick={() => setStyleFilter(v)} className={`px-2 py-1 rounded-full font-semibold transition-all ${styleFilter === v ? "bg-white/[.08] text-[#D77E00]" : "text-[#888] hover:text-white"}`}>
                  {v}{v !== "All" && <span className="text-[#666] ml-0.5">{counts[v as Style]}</span>}
                </button>
              ))}
            </div>
            <span className="text-[#333]">|</span>
            {/* Page type */}
            <select value={pageFilter} onChange={e => setPageFilter(e.target.value as PageType | "All")} className="bg-white/[.04] border border-white/[.08] rounded-lg px-2 py-1 text-[11px] text-[#ccc]">
              <option value="All">All Pages</option>
              <option value="single">Single Page</option>
              <option value="multi">Multi Page</option>
            </select>
            {/* Industry */}
            <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="bg-white/[.04] border border-white/[.08] rounded-lg px-2 py-1 text-[11px] text-[#ccc]">
              <option value="All">All Industries</option>
              {allIndustries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {/* Features */}
            <select value={featureFilter} onChange={e => setFeatureFilter(e.target.value)} className="bg-white/[.04] border border-white/[.08] rounded-lg px-2 py-1 text-[11px] text-[#ccc]">
              <option value="All">All Features</option>
              {allFeatures.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {/* Reset */}
            {(styleFilter !== "All" || pageFilter !== "All" || industryFilter !== "All" || featureFilter !== "All" || search) && (
              <button onClick={() => { setStyleFilter("All"); setPageFilter("All"); setIndustryFilter("All"); setFeatureFilter("All"); setSearch(""); }} className="text-[#D77E00] hover:text-white px-2 py-1">
                Clear all
              </button>
            )}
          </div>
          )}

          {/* Filter row — current sites */}
          {topTab === "current" && (
          <div className="flex items-center gap-2 text-[11px]">
            <p className="text-[#888]">{filteredHosted.length} of {hostedSites.length} live sites</p>
          </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ═══ CURRENT SITES TAB ═══ */}
        {topTab === "current" && (
          <>
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHosted.map(site => (
                  <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl overflow-hidden border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#08080C]">
                      <iframe src={site.url} title={site.name} className="pointer-events-none" loading="lazy" tabIndex={-1} style={{ width: 1280, height: 800, transform: "scale(0.25)", transformOrigin: "top left", position: "absolute", top: 0, left: 0 }} />
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${site.colors[0]}, ${site.colors[1]})` }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">Visit <ArrowUpRight className="h-3 w-3" /></span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${platformBadge(site.platform)}`}>{site.platform}</span>
                      </div>
                      <p className="text-[11px] text-[#888] leading-relaxed">{site.industry}</p>
                      <p className="text-[10px] text-[#555] mt-1 truncate">{site.url.replace("https://", "")}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredHosted.map(site => (
                  <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-3 rounded-xl border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all">
                    <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${site.colors[0]}, ${site.colors[1]})` }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${platformBadge(site.platform)}`}>{site.platform}</span>
                      </div>
                      <p className="text-[11px] text-[#888] truncate">{site.industry} · {site.url.replace("https://", "")}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#888] group-hover:text-[#D77E00] flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            )}

            {filteredHosted.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#888] text-sm">No sites match your search.</p>
                <button onClick={() => setHostedSearch("")} className="mt-3 text-[#D77E00] text-sm hover:text-white">Clear search</button>
              </div>
            )}

            <div className="text-center py-10 text-xs text-[#444]">
              <p>{hostedSites.length} live sites · {hostedSites.filter(s => s.platform === "WordPress").length} WordPress · {hostedSites.filter(s => s.platform === "Custom").length} Custom</p>
              <p className="mt-1">Hosted by <span className="text-[#D77E00]/60">Digital Official</span></p>
            </div>
          </>
        )}

        {/* ═══ TEMPLATES TAB ═══ */}
        {topTab === "templates" && (<>
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(site => (
              <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl overflow-hidden border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#08080C]">
                  <iframe src={site.url} title={site.name} className="pointer-events-none" loading="lazy" tabIndex={-1} style={{ width: 1280, height: 800, transform: "scale(0.25)", transformOrigin: "top left", position: "absolute", top: 0, left: 0 }} />
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${site.colors[0]}, ${site.colors[1]})` }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">Visit <ArrowUpRight className="h-3 w-3" /></span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${styleBadge(site.style)}`}>{site.style}</span>
                  </div>
                  <p className="text-[11px] text-[#888] leading-relaxed">{site.industry} · {site.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[9px] text-[#666] bg-white/[.03] px-1.5 py-0.5 rounded">{site.font}</span>
                    <span className="text-[9px] text-[#666] bg-white/[.03] px-1.5 py-0.5 rounded">{site.pages === "multi" ? "Multi-page" : "Single page"}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* List view */
          <div className="space-y-2">
            {filtered.map(site => (
              <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-3 rounded-xl border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all">
                <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${site.colors[0]}, ${site.colors[1]})` }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${styleBadge(site.style)}`}>{site.style}</span>
                    <span className="text-[9px] text-[#666] bg-white/[.03] px-1.5 py-0.5 rounded flex-shrink-0">{site.pages === "multi" ? "Multi" : "Single"}</span>
                  </div>
                  <p className="text-[11px] text-[#888] truncate">{site.industry} · {site.description}</p>
                </div>
                <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px]">
                  {site.features.slice(0, 3).map(f => (
                    <span key={f} className="text-[8px] text-[#666] bg-white/[.03] px-1.5 py-0.5 rounded">{f}</span>
                  ))}
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#888] group-hover:text-[#D77E00] flex-shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#888] text-sm">No sites match your filters.</p>
            <button onClick={() => { setStyleFilter("All"); setPageFilter("All"); setIndustryFilter("All"); setFeatureFilter("All"); setSearch(""); }} className="mt-3 text-[#D77E00] text-sm hover:text-white">Clear all filters</button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-10 text-xs text-[#444]">
          <p>{sites.length} templates · 5 style generations · {new Set(sites.map(s => s.font)).size} fonts · {allIndustries.length} industries</p>
          <p className="mt-1">Built by <span className="text-[#D77E00]/60">Digital Official</span></p>
        </div>
        </>)}
      </main>
    </div>
  );
}
