"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Monitor, Smartphone, ExternalLink } from "lucide-react";

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
  { name: "Sugar & Bloom Bakery", industry: "Bakery", url: "https://sugar-and-bloom-bakery-v3.vercel.app", style: "V3", colors: ["#FF85A2", "#F5D5A0"], font: "Quicksand", description: "Glass cards, warm pink & cream gold" },
  { name: "The Wax Lounge", industry: "Esthetics", url: "https://the-wax-lounge-v3.vercel.app", style: "V3", colors: ["#D4AF37", "#E8A0BF"], font: "Manrope", description: "Champagne gold, spinning glow borders" },
  { name: "Drift Wellness", industry: "Med Spa", url: "https://drift-wellness-v3.vercel.app", style: "V3", colors: ["#5EEAD4", "#A78BFA"], font: "DM Sans", description: "Teal & violet glassmorphism" },
  { name: "Canopy Tree Service", industry: "Tree Service", url: "https://canopy-tree-service-v4.vercel.app", style: "V4", colors: ["#4ADE80", "#0A120A"], font: "Space Grotesk", description: "Scroll-driven, sticky hero, holo cards" },
  { name: "Lucky Paws Vet", industry: "Veterinary", url: "https://lucky-paws-vet-v4.vercel.app", style: "V4", colors: ["#F59E0B", "#FB7185"], font: "Nunito", description: "Scroll-driven, word reveals, seamless" },
  { name: "Iron & Oak Furniture", industry: "Custom Furniture", url: "https://iron-and-oak-furniture-v4.vercel.app", style: "V4", colors: ["#D97706", "#94A3B8"], font: "Playfair Display", description: "Horizontal portfolio, copper artisan" },
  { name: "Midnight Auto Detail", industry: "Car Detailing", url: "https://midnight-auto-detail-v4.vercel.app", style: "V4", colors: ["#C0C0C0", "#1E3A5F"], font: "Montserrat", description: "Chrome metallic, premium true black" },
  { name: "The Juice Standard", industry: "Juice Bar", url: "https://the-juice-standard-v4.vercel.app", style: "V4", colors: ["#BFFF00", "#FF9500"], font: "Urbanist", description: "Lime energy, citrus glow, organic vibes" },
  { name: "Ember & Stone Pizza", industry: "Pizzeria", url: "https://ember-and-stone-pizza-v4.vercel.app", style: "V4", colors: ["#E8590C", "#78716C"], font: "Bitter", description: "Wood-fired, warm ember serif, artisan" },
  { name: "Blooming Nails Studio", industry: "Nail Salon", url: "https://blooming-nails-studio-v4.vercel.app", style: "V4", colors: ["#EC4899", "#C084FC"], font: "Poppins", description: "Hot pink/lilac, nail art gallery" },
  { name: "Atlas Moving Co.", industry: "Moving Company", url: "https://atlas-moving-v4.vercel.app", style: "V4", colors: ["#2563EB", "#F97316"], font: "Lexend", description: "Bold blue/orange, strong & reliable" },
  { name: "Tucson Twinkle", industry: "Holiday Lights", url: "https://tucson-twinkle-v4.vercel.app", style: "V4", colors: ["#FFD700", "#DC2626"], font: "Quicksand", description: "Twinkling light particles, magical, 4 tiers" },
];

const styleBadge = (s: string) =>
  s === "V1" ? "bg-blue-500/15 text-blue-400" :
  s === "V2" ? "bg-yellow-500/15 text-yellow-400" :
  s === "V3" ? "bg-purple-500/15 text-purple-400" :
  "bg-emerald-500/15 text-emerald-400";

export default function Library() {
  const [current, setCurrent] = useState(0);
  const [filter, setFilter] = useState<"All" | "V1" | "V2" | "V3" | "V4">("All");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [iframeReady, setIframeReady] = useState(false);

  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelLocked = useRef(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const filtered = filter === "All" ? sites : sites.filter(s => s.style === filter);
  const total = filtered.length;

  const next = useCallback(() => { setCurrent(c => (c + 1) % total); setIframeReady(false); }, [total]);
  const prev = useCallback(() => { setCurrent(c => (c - 1 + total) % total); setIframeReady(false); }, [total]);

  useEffect(() => { setCurrent(0); setIframeReady(false); }, [filter]);
  useEffect(() => { const t = setTimeout(() => setIframeReady(true), 300); return () => clearTimeout(t); }, [current]);

  // Keyboard + wheel
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    const wheelHandler = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-iframe-scroll]")) return;
      e.preventDefault();
      if (wheelLocked.current) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 20) {
        wheelLocked.current = true;
        delta > 0 ? next() : prev();
        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        wheelTimeout.current = setTimeout(() => { wheelLocked.current = false; }, 500);
      }
    };
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("wheel", wheelHandler, { passive: false });
    return () => { window.removeEventListener("keydown", keyHandler); window.removeEventListener("wheel", wheelHandler); };
  }, [next, prev]);

  // Drag handlers (only on the frame area)
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-iframe-scroll]")) return;
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    setDragX(0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - dragStartX.current);
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = window.innerWidth * 0.12;
    const velocity = Math.abs(dragX) / (Date.now() - dragStartTime.current);
    if (dragX < -threshold || (dragX < -20 && velocity > 0.25)) next();
    else if (dragX > threshold || (dragX > 20 && velocity > 0.25)) prev();
    setDragX(0);
  };

  const site = filtered[current];

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden select-none bg-void text-ink">
      <div className="mesh-bg" />

      {/* ═══ HEADER ═══ */}
      <header className="relative z-30 px-4 sm:px-6 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-base sm:text-lg">
            <span className="text-accent">Digital Official</span>{" "}
            <span className="text-muted font-normal text-xs sm:text-sm">Site Library</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View toggle — hidden on small mobile */}
            <div className="hidden sm:flex items-center gap-1 glass rounded-full p-1">
              <button onClick={() => setViewMode("desktop")} className={`p-1.5 rounded-full transition-colors ${viewMode === "desktop" ? "bg-white/10 text-accent" : "text-muted"}`}>
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setViewMode("mobile")} className={`p-1.5 rounded-full transition-colors ${viewMode === "mobile" ? "bg-white/10 text-accent" : "text-muted"}`}>
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
            {/* Filters */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {(["All", "V1", "V2", "V3", "V4"] as const).map(v => (
                <button key={v} onClick={() => setFilter(v)} className={`px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all ${filter === v ? "glass-strong text-accent" : "text-muted hover:text-ink"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MOBILE / TABLET: Stacked layout ═══ */}
      <div className="lg:hidden flex flex-col h-[calc(100dvh-100px)]">
        {/* Site info bar */}
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1 w-8 rounded-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${site?.colors[0]}, ${site?.colors[1]})` }} />
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${styleBadge(site?.style || "V1")}`}>{site?.style}</span>
              <span className="text-[9px] text-muted">{site?.font}</span>
            </div>
            <p className="font-display font-bold text-lg leading-tight truncate">{site?.name}</p>
            <p className="text-xs text-muted truncate">{site?.industry} &middot; {site?.description}</p>
          </div>
          <a href={site?.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 ml-3 glass rounded-full p-2.5 text-accent hover:text-electric" onClick={e => e.stopPropagation()}>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Browser frame — fills remaining space */}
        <div
          className="flex-1 mx-3 sm:mx-5 mb-2 relative"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "pan-y" }}
        >
          <div
            className="h-full rounded-xl overflow-hidden glass-strong"
            style={{
              transform: dragging ? `translateX(${dragX}px) rotate(${dragX * 0.008}deg)` : undefined,
              transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Browser chrome */}
            <div className="h-7 bg-white/[.03] border-b border-white/[.06] flex items-center px-3 gap-2 flex-shrink-0">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
              </div>
              <div className="flex-1 mx-1">
                <div className="bg-white/[.04] rounded px-2 py-0.5 text-[8px] text-muted truncate text-center">{site?.url?.replace("https://", "")}</div>
              </div>
            </div>
            {/* Scrollable iframe */}
            <div data-iframe-scroll className="overflow-y-auto overflow-x-hidden" style={{ height: "calc(100% - 28px)" }}>
              {iframeReady && (
                <iframe
                  src={site?.url}
                  title={site?.name}
                  className="pointer-events-auto"
                  style={{
                    width: 1280,
                    height: 4000,
                    transform: `scale(${(window?.innerWidth ? Math.min(window.innerWidth - 24, 680) : 380) / 1280})`,
                    transformOrigin: "top left",
                  }}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="px-4 pb-3 pt-1">
          <div className="flex items-center justify-center gap-4">
            <button onClick={prev} className="glass w-9 h-9 rounded-full flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></button>
            <span className="font-display font-bold text-xs text-muted"><span className="text-ink">{current + 1}</span> / {total}</span>
            <button onClick={next} className="glass w-9 h-9 rounded-full flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* ═══ DESKTOP: Three-column layout ═══ */}
      <div className="hidden lg:flex items-stretch" style={{ height: "calc(100dvh - 52px)" }}>
        {/* Left info panel */}
        <div className="w-[280px] flex-shrink-0 flex flex-col justify-center pl-8 pr-5">
          <div className="h-1 w-14 rounded-full mb-5" style={{ background: `linear-gradient(90deg, ${site?.colors[0]}, ${site?.colors[1]})` }} />
          <p className="font-display font-bold text-2xl xl:text-3xl leading-tight mb-1">{site?.name}</p>
          <p className="text-sm text-muted mb-4">{site?.industry}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styleBadge(site?.style || "V1")}`}>{site?.style}</span>
            <span className="text-[10px] text-muted">{site?.font}</span>
          </div>
          <p className="text-xs text-muted leading-relaxed mb-5">{site?.description}</p>
          <a href={site?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-electric transition-colors" onClick={e => e.stopPropagation()}>
            Visit site <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* Center: browser frame */}
        <div
          className="flex-1 flex items-start justify-center pt-2 pb-4"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          <div
            ref={frameRef}
            className="relative rounded-xl overflow-hidden glass-strong h-full transition-all duration-500"
            style={{
              width: viewMode === "desktop" ? "100%" : 280,
              maxWidth: viewMode === "desktop" ? 720 : 280,
              transform: dragging ? `translateX(${dragX}px) rotate(${dragX * 0.008}deg)` : undefined,
              transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.16,1,0.3,1), width 0.5s ease, max-width 0.5s ease",
            }}
          >
            {/* Browser chrome */}
            <div className="h-8 bg-white/[.03] border-b border-white/[.06] flex items-center px-3 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
              <div className="flex-1 mx-2">
                <div className="bg-white/[.04] rounded-md px-3 py-0.5 text-[9px] text-muted truncate text-center">{site?.url}</div>
              </div>
            </div>
            {/* Scrollable iframe */}
            <div data-iframe-scroll className="overflow-y-auto overflow-x-hidden" style={{ height: "calc(100% - 32px)" }}>
              {iframeReady && (
                <iframe
                  src={site?.url}
                  title={site?.name}
                  className="pointer-events-auto"
                  style={{
                    width: viewMode === "desktop" ? 1280 : 390,
                    height: 4000,
                    transform: `scale(${viewMode === "desktop" ? 720 / 1280 : 280 / 390})`,
                    transformOrigin: "top left",
                  }}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: site list + nav */}
        <div className="w-[260px] flex-shrink-0 flex flex-col pr-6 pl-4 py-4">
          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
            {filtered.map((s, i) => (
              <button
                key={s.name}
                onClick={() => { setCurrent(i); setIframeReady(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  i === current ? "glass-strong text-ink" : "text-muted/50 hover:text-muted hover:bg-white/[.02]"
                }`}
              >
                <span className="font-semibold block truncate">{s.name}</span>
                {i === current && <span className="block text-[10px] text-muted mt-0.5">{s.industry}</span>}
              </button>
            ))}
          </div>
          {/* Desktop bottom nav */}
          <div className="pt-3 mt-2 border-t border-white/[.06] flex items-center justify-center gap-4">
            <button onClick={prev} className="glass w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[.08]"><ChevronLeft className="h-4 w-4" /></button>
            <span className="font-display font-bold text-xs text-muted"><span className="text-ink">{current + 1}</span>/{total}</span>
            <button onClick={next} className="glass w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[.08]"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
