"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Monitor, Smartphone, ExternalLink, Layers } from "lucide-react";

interface Site {
  name: string;
  industry: string;
  url: string;
  style: "V1" | "V2" | "V3" | "V4";
  colors: [string, string];
  font: string;
  description: string;
}

const sites: Site[] = [
  { name: "Catalina Garage", industry: "Auto Repair", url: "https://catalina-garage.vercel.app", style: "V1", colors: ["#C0392B", "#45B5AA"], font: "Bricolage Grotesque", description: "Retro halftone dots, cherry & turquoise" },
  { name: "Copper Creek Plumbing", industry: "Plumbing", url: "https://copper-creek-plumbing.vercel.app", style: "V1", colors: ["#2E6F9E", "#C47A3A"], font: "Bricolage Grotesque", description: "Water ripple animations, steel blue & copper" },
  { name: "Dark Sky Coffee", industry: "Coffee Shop", url: "https://dark-sky-coffee.vercel.app", style: "V1", colors: ["#1E3A5F", "#D4A43C"], font: "Bricolage Grotesque", description: "Astronomy starfield, midnight & gold" },
  { name: "Ironwood Landscaping", industry: "Landscaping", url: "https://ironwood-landscaping.vercel.app", style: "V1", colors: ["#3D6B4E", "#C4915E"], font: "Bricolage Grotesque", description: "Desert foliage noise, sage & terracotta" },
  { name: "Platinum Pool Service", industry: "Pool Service", url: "https://platinum-pool-service.vercel.app", style: "V1", colors: ["#1E5BA8", "#5BA7DB"], font: "Bricolage Grotesque", description: "Pool caustics, marine blue + brand page" },
  { name: "Slab & Grain Flooring", industry: "Flooring", url: "https://slab-and-grain-flooring.vercel.app", style: "V1", colors: ["#6B4226", "#D4A44C"], font: "Bricolage Grotesque", description: "Wood grain texture, walnut & honey" },
  { name: "Bark & Bloom Pet Spa", industry: "Dog Grooming", url: "https://bark-and-bloom-grooming.vercel.app", style: "V1", colors: ["#FF6B6B", "#4ECDC4"], font: "Bricolage Grotesque", description: "Floating paw prints, coral & mint" },
  { name: "Digital Official", industry: "Marketing Agency", url: "https://the-digital-official.vercel.app", style: "V1", colors: ["#D77E00", "#00B4D8"], font: "Bricolage Grotesque", description: "Geometric grid, dark agency theme" },
  { name: "Gadget Geeks Plus", industry: "Electronics", url: "https://gadget-geeks-plus.vercel.app", style: "V1", colors: ["#39FF14", "#B026FF"], font: "Bricolage Grotesque", description: "Circuit board neon, repair + buy/sell/trade" },
  { name: "Tiny Explorers Academy", industry: "Daycare", url: "https://tiny-explorers-academy.vercel.app", style: "V1", colors: ["#4FC3F7", "#F06292"], font: "Fredoka", description: "Rainbow shapes, crayon dividers, playful" },
  { name: "Ink & Iron Studio", industry: "Tattoo & Piercing", url: "https://ink-and-iron-studio-v2.vercel.app", style: "V2", colors: ["#C41E3A", "#C9A96E"], font: "Playfair Display", description: "Dark editorial, noise grain, scroll portfolio" },
  { name: "The Fade Room", industry: "Barbershop", url: "https://the-fade-room-v2.vercel.app", style: "V2", colors: ["#D4A017", "#1C1C1C"], font: "Space Grotesk", description: "Luxury barber, stacked type, gold" },
  { name: "Fuego Street Kitchen", industry: "Food Truck", url: "https://fuego-street-kitchen-v2.vercel.app", style: "V2", colors: ["#FF5722", "#AACC00"], font: "Archivo Black", description: "Bold street culture, angled dividers" },
  { name: "Grit Athletics", industry: "Fitness / Gym", url: "https://grit-athletics-v2.vercel.app", style: "V2", colors: ["#E8FF00", "#000000"], font: "Bebas Neue", description: "Brutalist industrial, signal yellow" },
  { name: "Spotless Co.", industry: "Cleaning Service", url: "https://spotless-co-v2.vercel.app", style: "V2", colors: ["#00C853", "#E8F5E9"], font: "Outfit", description: "Ultra-clean, floating bubbles, mint" },
  { name: "Arctic Air Pros", industry: "HVAC / AC", url: "https://arctic-air-pros-v2.vercel.app", style: "V2", colors: ["#00BCD4", "#0B1426"], font: "Sora", description: "Cool tech, ice crystal hex, dark navy" },
  { name: "Shutter & Light", industry: "Photography", url: "https://shutter-and-light-v2.vercel.app", style: "V2", colors: ["#C5A55A", "#000000"], font: "Cormorant Garamond", description: "Editorial gallery, masonry, cinematic" },
  { name: "Summit Roofing Co.", industry: "Roofing", url: "https://summit-roofing-v2.vercel.app", style: "V2", colors: ["#B87333", "#1B2432"], font: "Lexend", description: "Roof-peak dividers, blueprint, copper" },
  { name: "Petal & Vine", industry: "Flower Shop", url: "https://petal-and-vine-v3.vercel.app", style: "V3", colors: ["#FF6B9D", "#C4B5FD"], font: "Plus Jakarta Sans", description: "Glassmorphism, rose pink mesh gradients" },
  { name: "Sugar & Bloom Bakery", industry: "Bakery", url: "https://sugar-and-bloom-bakery-v3.vercel.app", style: "V3", colors: ["#FF85A2", "#F5D5A0"], font: "Quicksand", description: "3D spinning cake, glass cards" },
  { name: "The Wax Lounge", industry: "Esthetics", url: "https://the-wax-lounge-v3.vercel.app", style: "V3", colors: ["#D4AF37", "#E8A0BF"], font: "Manrope", description: "Champagne gold, spinning glow borders" },
  { name: "Drift Wellness", industry: "Med Spa", url: "https://drift-wellness-v3.vercel.app", style: "V3", colors: ["#5EEAD4", "#A78BFA"], font: "DM Sans", description: "Teal & violet glassmorphism" },
  { name: "Canopy Tree Service", industry: "Tree Service", url: "https://canopy-tree-service-v4.vercel.app", style: "V4", colors: ["#4ADE80", "#0A120A"], font: "Space Grotesk", description: "Scroll-driven, holo cards, forest green" },
  { name: "Lucky Paws Vet", industry: "Veterinary", url: "https://lucky-paws-vet-v4.vercel.app", style: "V4", colors: ["#F59E0B", "#FB7185"], font: "Nunito", description: "Word reveals, warm amber, friendly" },
  { name: "Iron & Oak Furniture", industry: "Custom Furniture", url: "https://iron-and-oak-furniture-v4.vercel.app", style: "V4", colors: ["#D97706", "#94A3B8"], font: "Playfair Display", description: "Framer Motion, copper artisan, portfolio" },
  { name: "Midnight Auto Detail", industry: "Car Detailing", url: "https://midnight-auto-detail-v4.vercel.app", style: "V4", colors: ["#C0C0C0", "#1E3A5F"], font: "Montserrat", description: "Chrome metallic, premium true black" },
  { name: "The Juice Standard", industry: "Juice Bar", url: "https://the-juice-standard-v4.vercel.app", style: "V4", colors: ["#BFFF00", "#FF9500"], font: "Urbanist", description: "Lime energy, citrus glow, organic" },
  { name: "Ember & Stone Pizza", industry: "Pizzeria", url: "https://ember-and-stone-pizza-v4.vercel.app", style: "V4", colors: ["#E8590C", "#78716C"], font: "Bitter", description: "Wood-fired, warm ember serif" },
  { name: "Blooming Nails Studio", industry: "Nail Salon", url: "https://blooming-nails-studio-v4.vercel.app", style: "V4", colors: ["#EC4899", "#C084FC"], font: "Poppins", description: "Hot pink/lilac, nail art gallery" },
  { name: "Atlas Moving Co.", industry: "Moving Company", url: "https://atlas-moving-v4.vercel.app", style: "V4", colors: ["#2563EB", "#F97316"], font: "Lexend", description: "Bold blue/orange, strong & reliable" },
  { name: "Tucson Twinkle", industry: "Holiday Lights", url: "https://tucson-twinkle-v4.vercel.app", style: "V4", colors: ["#FFD700", "#DC2626"], font: "Quicksand", description: "SVG house with scroll-activated lights" },
];

const badge = (s: string) =>
  s === "V1" ? "bg-blue-500/15 text-blue-400 border-blue-500/20" :
  s === "V2" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" :
  s === "V3" ? "bg-purple-500/15 text-purple-400 border-purple-500/20" :
  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";

export default function Library() {
  const [filter, setFilter] = useState<"All" | "V1" | "V2" | "V3" | "V4">("All");
  const [selected, setSelected] = useState<Site | null>(null);

  const filtered = filter === "All" ? sites : sites.filter(s => s.style === filter);
  const counts = { V1: sites.filter(s => s.style === "V1").length, V2: sites.filter(s => s.style === "V2").length, V3: sites.filter(s => s.style === "V3").length, V4: sites.filter(s => s.style === "V4").length };

  return (
    <div className="min-h-[100dvh] bg-void text-ink">

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 bg-void/80 backdrop-blur-xl border-b border-white/[.06]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-base">
              <span className="text-accent">Digital Official</span>
            </h1>
            <p className="text-[10px] text-muted">Site Library &middot; {filtered.length} sites</p>
          </div>
          <div className="flex items-center gap-1">
            {(["All", "V1", "V2", "V3", "V4"] as const).map(v => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  filter === v ? "glass text-accent" : "text-muted"
                }`}
              >
                {v}
                {v !== "All" && <span className="text-muted/40 ml-0.5 text-[9px]">{counts[v]}</span>}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ CARD GRID ═══ */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden border border-white/[.06] bg-surface hover:border-white/[.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
            >
              {/* Preview — iframe thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-void">
                <iframe
                  src={site.url}
                  title={site.name}
                  className="pointer-events-none"
                  loading="lazy"
                  style={{
                    width: 1280,
                    height: 800,
                    transform: "scale(0.25)",
                    transformOrigin: "top left",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  tabIndex={-1}
                />
                {/* Gradient strip at top */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${site.colors[0]}, ${site.colors[1]})` }} />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    Visit site <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-bold text-sm group-hover:text-accent transition-colors">{site.name}</h2>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badge(site.style)}`}>{site.style}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{site.industry} &middot; {site.description}</p>
                <p className="text-[10px] text-muted/50 mt-2">{site.font}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-10 text-xs text-muted/40">
          <p>{sites.length} sites &middot; 4 style generations &middot; {new Set(sites.map(s => s.font)).size} unique fonts</p>
          <p className="mt-1">Built by <span className="text-accent/60">Digital Official</span></p>
        </div>
      </main>
    </div>
  );
}
