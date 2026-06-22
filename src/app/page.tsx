"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Monitor, Smartphone } from "lucide-react";

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

export default function Library() {
  const [current, setCurrent] = useState(0);
  const [filter, setFilter] = useState<"All" | "V1" | "V2" | "V3" | "V4">("All");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelLocked = useRef(false);

  const filtered = filter === "All" ? sites : sites.filter(s => s.style === filter);
  const total = filtered.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  useEffect(() => { setCurrent(0); }, [filter]);

  // Keyboard
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (wheelLocked.current) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 15) {
        wheelLocked.current = true;
        delta > 0 ? next() : prev();
        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        wheelTimeout.current = setTimeout(() => { wheelLocked.current = false; }, 400);
      }
    };
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("wheel", wheelHandler, { passive: false });
    return () => { window.removeEventListener("keydown", keyHandler); window.removeEventListener("wheel", wheelHandler); };
  }, [next, prev]);

  // Mouse drag
  const onDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartTime.current = Date.now();
    setDragX(0);
  };
  const onDragMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - dragStartX.current);
  };
  const onDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const threshold = window.innerWidth * 0.15; // 15% of screen width
    const velocity = Math.abs(dragX) / (Date.now() - dragStartTime.current); // px/ms
    if (dragX < -threshold || (dragX < -30 && velocity > 0.3)) next();
    else if (dragX > threshold || (dragX > 30 && velocity > 0.3)) prev();
    setDragX(0);
  };

  // Touch drag
  const onTouchStart = (e: React.TouchEvent) => { dragStartX.current = e.touches[0].clientX; dragStartTime.current = Date.now(); };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - dragStartX.current;
    const velocity = Math.abs(dx) / (Date.now() - dragStartTime.current);
    const threshold = window.innerWidth * 0.15;
    if (dx < -threshold || (dx < -30 && velocity > 0.3)) next();
    else if (dx > threshold || (dx > 30 && velocity > 0.3)) prev();
  };

  const site = filtered[current];
  const iframeW = viewMode === "desktop" ? 1280 : 390;
  const iframeH = viewMode === "desktop" ? 3000 : 2400;

  return (
    <div
      className="relative h-screen w-screen overflow-hidden select-none"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="mesh-bg" />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-6 md:px-10 pt-4 pb-2">
        <div>
          <h1 className="font-display font-bold text-lg">
            <span className="text-accent">Digital Official</span> <span className="text-muted font-normal text-sm">Site Library</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="flex items-center gap-1 glass rounded-full p-1">
            <button onClick={() => setViewMode("desktop")} className={`p-1.5 rounded-full transition-colors ${viewMode === "desktop" ? "bg-white/10 text-accent" : "text-muted"}`}><Monitor className="h-3.5 w-3.5" /></button>
            <button onClick={() => setViewMode("mobile")} className={`p-1.5 rounded-full transition-colors ${viewMode === "mobile" ? "bg-white/10 text-accent" : "text-muted"}`}><Smartphone className="h-3.5 w-3.5" /></button>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-1">
            {(["All", "V1", "V2", "V3", "V4"] as const).map(v => (
              <button key={v} onClick={() => setFilter(v)} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${filter === v ? "glass-strong text-accent" : "text-muted hover:text-ink"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main preview area */}
      <div className="relative z-10 flex items-start justify-center" style={{ height: "calc(100vh - 110px)" }}>
        {/* Side info panel */}
        <div className="hidden lg:flex flex-col justify-center h-full w-[260px] pl-8 pr-4 flex-shrink-0">
          <div className="h-1 w-12 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${site?.colors[0]}, ${site?.colors[1]})` }} />
          <p className="font-display font-bold text-2xl leading-tight mb-1">{site?.name}</p>
          <p className="text-sm text-muted mb-3">{site?.industry}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              site?.style === "V1" ? "bg-blue-500/10 text-blue-400" :
              site?.style === "V2" ? "bg-yellow-500/10 text-yellow-400" :
              site?.style === "V3" ? "bg-purple-500/10 text-purple-400" :
              "bg-emerald-500/10 text-emerald-400"
            }`}>{site?.style}</span>
            <span className="text-[10px] text-muted">{site?.font}</span>
          </div>
          <p className="text-xs text-muted leading-relaxed mb-4">{site?.description}</p>
          <a href={site?.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-electric transition-colors" onClick={e => e.stopPropagation()}>
            Visit site <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* Browser frame with scrollable iframe */}
        <div className="relative flex-1 max-w-[680px] h-full flex items-start justify-center pt-2">
          <div
            className="relative rounded-xl overflow-hidden glass-strong transition-all duration-500"
            style={{
              width: viewMode === "desktop" ? "100%" : 240,
              height: "calc(100vh - 140px)",
              transform: dragging ? `translateX(${dragX}px) rotate(${dragX * 0.01}deg)` : undefined,
              transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.16,1,0.3,1), width 0.5s ease",
            }}
          >
            {/* Browser chrome */}
            <div className="h-8 bg-white/[.03] border-b border-white/[.06] flex items-center px-3 gap-2 flex-shrink-0">
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
            <div className="overflow-y-auto overflow-x-hidden" style={{ height: "calc(100% - 32px)" }} onMouseDown={e => e.stopPropagation()}>
              <iframe
                src={site?.url}
                title={site?.name}
                className="pointer-events-auto"
                style={{
                  width: iframeW,
                  height: iframeH,
                  transform: `scale(${viewMode === "desktop" ? 680 / iframeW : 240 / iframeW})`,
                  transformOrigin: "top left",
                }}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Right side — mobile info (lg:hidden) + nav */}
        <div className="hidden lg:flex flex-col justify-center h-full w-[260px] pr-8 pl-4 flex-shrink-0">
          <div className="space-y-2">
            {filtered.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setCurrent(i)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  i === current ? "glass-strong text-ink" : "text-muted/60 hover:text-muted"
                }`}
              >
                <span className="font-semibold">{s.name}</span>
                {i === current && <span className="block text-[10px] text-muted mt-0.5">{s.industry}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pb-4">
        <div className="flex items-center justify-center gap-6">
          <button onClick={prev} className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[.08] transition-colors"><ChevronLeft className="h-4 w-4" /></button>
          <div className="flex items-center gap-1">
            {filtered.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`nav-dot ${i === current ? "active" : ""}`} />
            ))}
          </div>
          <button onClick={next} className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[.08] transition-colors"><ChevronRight className="h-4 w-4" /></button>
        </div>
        {/* Mobile info bar */}
        <div className="lg:hidden text-center mt-2">
          <p className="font-display font-bold text-sm">{site?.name} <span className="text-muted font-normal">· {site?.industry}</span></p>
        </div>
      </div>
    </div>
  );
}
