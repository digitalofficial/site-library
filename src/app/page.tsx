"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, ArrowUpRight } from "lucide-react";

interface Site {
  name: string;
  industry: string;
  url: string;
  style: "V1" | "V2" | "V3";
  colors: [string, string];
  font: string;
  description: string;
}

const sites: Site[] = [
  { name: "Catalina Garage", industry: "Auto Repair", url: "https://catalina-garage.vercel.app", style: "V1", colors: ["#C0392B", "#45B5AA"], font: "Bricolage Grotesque", description: "Retro halftone dots, cherry & turquoise, old-school garage aesthetic" },
  { name: "Copper Creek Plumbing", industry: "Plumbing", url: "https://copper-creek-plumbing.vercel.app", style: "V1", colors: ["#2E6F9E", "#C47A3A"], font: "Bricolage Grotesque", description: "Water ripple animations, steel blue & warm copper tones" },
  { name: "Dark Sky Coffee", industry: "Coffee Shop", url: "https://dark-sky-coffee.vercel.app", style: "V1", colors: ["#1E3A5F", "#D4A43C"], font: "Bricolage Grotesque", description: "Astronomy-inspired starfield, deep midnight & gold" },
  { name: "Ironwood Landscaping", industry: "Landscaping", url: "https://ironwood-landscaping.vercel.app", style: "V1", colors: ["#3D6B4E", "#C4915E"], font: "Bricolage Grotesque", description: "Desert botanical foliage noise, sage green & terracotta" },
  { name: "Platinum Pool Service", industry: "Pool Service", url: "https://platinum-pool-service.vercel.app", style: "V1", colors: ["#1E5BA8", "#5BA7DB"], font: "Bricolage Grotesque", description: "Pool caustics, marine blue, includes brand identity page" },
  { name: "Slab & Grain Flooring", industry: "Flooring", url: "https://slab-and-grain-flooring.vercel.app", style: "V1", colors: ["#6B4226", "#D4A44C"], font: "Bricolage Grotesque", description: "Wood grain texture pattern, walnut & honey tones" },
  { name: "Bark & Bloom Pet Spa", industry: "Dog Grooming", url: "https://bark-and-bloom-grooming.vercel.app", style: "V1", colors: ["#FF6B6B", "#4ECDC4"], font: "Bricolage Grotesque", description: "Floating paw prints, coral & mint, mobile grooming focus" },
  { name: "Digital Official", industry: "Marketing Agency", url: "https://the-digital-official.vercel.app", style: "V1", colors: ["#D77E00", "#00B4D8"], font: "Bricolage Grotesque", description: "Geometric grid, dark theme, agency rebrand with 8 service LPs" },
  { name: "Gadget Geeks Plus", industry: "Electronics", url: "https://gadget-geeks-plus.vercel.app", style: "V1", colors: ["#39FF14", "#B026FF"], font: "Bricolage Grotesque", description: "Circuit board neon, split repair vs buy/sell/trade navigation" },
  { name: "Tiny Explorers Academy", industry: "Daycare", url: "https://tiny-explorers-academy.vercel.app", style: "V1", colors: ["#4FC3F7", "#F06292"], font: "Fredoka", description: "Rainbow floating shapes, crayon dividers, playful & colorful" },
  { name: "Ink & Iron Studio", industry: "Tattoo & Piercing", url: "https://ink-and-iron-studio-v2.vercel.app", style: "V2", colors: ["#C41E3A", "#C9A96E"], font: "Playfair Display", description: "Dark editorial, noise grain, horizontal scroll portfolio" },
  { name: "The Fade Room", industry: "Barbershop", url: "https://the-fade-room-v2.vercel.app", style: "V2", colors: ["#D4A017", "#1C1C1C"], font: "Space Grotesk", description: "Luxury barber, stacked type, barber stripe animation" },
  { name: "Fuego Street Kitchen", industry: "Food Truck", url: "https://fuego-street-kitchen-v2.vercel.app", style: "V2", colors: ["#FF5722", "#AACC00"], font: "Archivo Black", description: "Bold street culture, angled dividers, fire menu ticker" },
  { name: "Grit Athletics", industry: "Fitness / Gym", url: "https://grit-athletics-v2.vercel.app", style: "V2", colors: ["#E8FF00", "#000000"], font: "Bebas Neue", description: "Brutalist industrial, massive counters, signal yellow" },
  { name: "Spotless Co.", industry: "Cleaning Service", url: "https://spotless-co-v2.vercel.app", style: "V2", colors: ["#00C853", "#E8F5E9"], font: "Outfit", description: "Ultra-clean, floating soap bubbles, fresh mint" },
  { name: "Arctic Air Pros", industry: "HVAC / AC", url: "https://arctic-air-pros-v2.vercel.app", style: "V2", colors: ["#00BCD4", "#0B1426"], font: "Sora", description: "Cool tech, ice crystal hex pattern, dark navy" },
  { name: "Shutter & Light", industry: "Photography", url: "https://shutter-and-light-v2.vercel.app", style: "V2", colors: ["#C5A55A", "#000000"], font: "Cormorant Garamond", description: "Editorial gallery, masonry grid, cinematic reveals" },
  { name: "Summit Roofing Co.", industry: "Roofing", url: "https://summit-roofing-v2.vercel.app", style: "V2", colors: ["#B87333", "#1B2432"], font: "Lexend", description: "Architectural, roof-peak dividers, blueprint pattern" },
];

function getPositionClass(offset: number): string {
  if (offset === 0) return "active";
  if (offset === -1) return "left-1";
  if (offset === -2) return "left-2";
  if (offset <= -3) return "left-3";
  if (offset === 1) return "right-1";
  if (offset === 2) return "right-2";
  if (offset >= 3) return "right-3";
  return "hidden-card";
}

export default function Library() {
  const [current, setCurrent] = useState(0);
  const [filter, setFilter] = useState<"All" | "V1" | "V2" | "V3">("All");
  const touchStartX = useRef(0);

  const filtered = filter === "All" ? sites : sites.filter(s => s.style === filter);
  const total = filtered.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  useEffect(() => {
    setCurrent(0);
  }, [filter]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  const site = filtered[current];

  return (
    <div className="relative h-screen w-screen overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="mesh-bg" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-10 pt-6">
        <div>
          <h1 className="font-display font-bold text-lg">
            <span className="text-accent">Digital Official</span> <span className="text-muted font-normal text-sm">Site Library</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {(["All", "V1", "V2", "V3"] as const).map(v => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === v
                  ? "glass-strong text-accent"
                  : "text-muted hover:text-ink"
              }`}
            >
              {v} {v !== "All" && <span className="text-muted/50 ml-0.5">({sites.filter(s => s.style === v).length})</span>}
            </button>
          ))}
        </div>
      </header>

      {/* Poster Rack */}
      <div className="relative z-10 poster-rack flex items-center justify-center" style={{ height: "calc(100vh - 140px)" }}>
        {filtered.map((s, i) => {
          const offset = i - current;
          const wrappedOffset = offset > total / 2 ? offset - total : offset < -total / 2 ? offset + total : offset;

          return (
            <div
              key={s.name}
              className={`poster-card absolute w-[340px] md:w-[420px] ${getPositionClass(wrappedOffset)}`}
              onClick={() => { if (wrappedOffset !== 0) setCurrent(i); }}
              style={{ height: "min(70vh, 560px)" }}
            >
              <div className="h-full rounded-2xl overflow-hidden glass-strong flex flex-col">
                {/* Color strip */}
                <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${s.colors[0]}, ${s.colors[1]})` }} />

                {/* Preview area */}
                <div className="flex-1 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${s.colors[0]}15, ${s.colors[1]}10)` }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-6">
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${s.colors[0]}30, ${s.colors[1]}20)`, border: `1px solid ${s.colors[0]}30` }}>
                        <span className="font-display font-bold text-2xl" style={{ color: s.colors[0] }}>
                          {s.name.charAt(0)}
                        </span>
                      </div>
                      <p className="font-display font-bold text-2xl md:text-3xl leading-tight">{s.name}</p>
                      <p className="text-sm text-muted mt-2">{s.industry}</p>
                    </div>
                  </div>
                </div>

                {/* Info panel */}
                <div className="p-5 border-t border-white/[.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.style === "V1" ? "bg-blue-500/10 text-blue-400" :
                      s.style === "V2" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-purple-500/10 text-purple-400"
                    }`}>{s.style}</span>
                    <span className="text-[10px] text-muted">{s.font}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{s.description}</p>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-electric transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    Visit site <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pb-6">
        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {filtered.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`nav-dot ${i === current ? "active" : ""}`} aria-label={`Go to site ${i + 1}`} />
          ))}
        </div>

        {/* Arrow buttons + count */}
        <div className="flex items-center justify-center gap-6">
          <button onClick={prev} className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/[.08] transition-colors" aria-label="Previous">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-display font-bold text-sm text-muted">
            <span className="text-ink">{current + 1}</span> / {total}
          </span>
          <button onClick={next} className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/[.08] transition-colors" aria-label="Next">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-[10px] text-muted/40 mt-3 hint-pulse">
          Use arrow keys or swipe to browse
        </p>
      </div>
    </div>
  );
}
