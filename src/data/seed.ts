// Seed data: the portfolio as it stood on 2026-09-20. The live list lives in
// Vercel Blob (data/sites.json, edited at /admin); this file only renders if
// Blob is unreachable, and feeds scripts/seed-blob.mjs for a first import.
import type { Style, PageType, Platform, Entry } from "@/lib/types";

// Type-only import above is erased, so `node --experimental-strip-types` can
// load this file without resolving the "@/" alias. Keep the slug helper local.
const slugOf = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");


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
  platform: Platform;
  colors: [string, string];
}

export const hostedSites: HostedSite[] = ([
  { name: "All About Drains", industry: "Drain Service", url: "https://allaboutdrainsaz.com", platform: "Vite", colors: ["#2563EB", "#1E40AF"] },
  { name: "Boil Society Co.", industry: "Seafood Boils", url: "https://boilsocietyco.com", platform: "Next.js", colors: ["#C0392B", "#F7EDD7"] },
  { name: "Em Pá", industry: "Empanada Cart · Online Ordering", url: "https://myempa.com", platform: "Next.js", colors: ["#EFA83C", "#16281E"] },
  { name: "Roof Wranglers", industry: "Roofing", url: "https://roof-wranglers.vercel.app", platform: "Next.js", colors: ["#B87333", "#1B2432"] },
  { name: "All Mountain Systems", industry: "IT Systems", url: "https://allmountainsystems.com", platform: "WordPress", colors: ["#0F766E", "#134E4A"] },
  { name: "NZ Barber", industry: "Barbershop", url: "https://app.nzbarber.com", platform: "Next.js", colors: ["#D4A017", "#1C1C1C"] },
  { name: "Cowboy Plumbing", industry: "Plumbing", url: "https://cowboyplumbingaz.com", platform: "Vite", colors: ["#92400E", "#451A03"] },
  { name: "Happy Carousel Daycare", industry: "Daycare", url: "https://happycarouselkids.com", platform: "Vite", colors: ["#F472B6", "#A855F7"] },
  { name: "Hero Breakfast", industry: "Nonprofit", url: "https://herobreakfast.com", platform: "Vite", colors: ["#DC2626", "#F59E0B"] },
  { name: "iDoRecruit", industry: "Recruiting", url: "https://idorecruit.com", platform: "Next.js", colors: ["#2563EB", "#06B6D4"] },
  { name: "Jackrabbit Plumbing & Gas", industry: "Plumbing & Gas", url: "https://jackrabbitplumbingfw.com", platform: "WordPress", colors: ["#EA580C", "#16A34A"] },
  { name: "Kingdom Recovery Roofing", industry: "Roofing", url: "https://kingdomrecoveryroofing.com", platform: "Vite", colors: ["#7C3AED", "#D4A017"] },
  { name: "Raycrete LLC", industry: "Concrete", url: "https://raycretellc.com", platform: "Next.js", colors: ["#78716C", "#44403C"] },
  { name: "The Horseshoe", industry: "Bar & Restaurant", url: "https://thehorseshoebenson.com", platform: "Vite", colors: ["#92400E", "#78350F"] },
  { name: "The Plumber Kings", industry: "Plumbing", url: "https://theplumberkings.com", platform: "Next.js", colors: ["#1D4ED8", "#FBBF24"] },
  { name: "On The Spot Locksmith", industry: "Locksmith", url: "https://tucsonlocksmithnow.com", platform: "Vite", colors: ["#DC2626", "#1C1917"] },
] as HostedSite[]).sort((a, b) => a.name.localeCompare(b.name));

/** Companies started under Digital Official — our own products, not client work. */
export const doProjects: HostedSite[] = [
  { name: "Tap Official", industry: "NFC smart cards · Tap and track your network", url: "https://tapofficial.com", platform: "Next.js", colors: ["#D77E00", "#14B8A6"] },
  { name: "Service Official", industry: "The Contractor Operating System · CRM, scheduling, estimates", url: "https://serviceofficial.app", platform: "Next.js", colors: ["#D77E00", "#00B4D8"] },
  { name: "LP Official", industry: "Paid-traffic landing pages with tracked leads", url: "https://lpofficial.com", platform: "Next.js", colors: ["#D77E00", "#1A1410"] },
  { name: "GuestQuest", industry: "Interactive event photo experiences", url: "https://guestquest.app", platform: "Next.js", colors: ["#6366F1", "#4F46E5"] },
];

export const sites: Site[] = [
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
  { name: "Mack o' Roni", industry: "Mac & Cheese Truck", url: "https://mack-o-roni.vercel.app", style: "V5", colors: ["#FCD34D", "#F97316"], font: "Fredoka", description: "Leprechaun mascot, fun yellow/orange, toppings bar", pages: "single", features: ["framer-motion", "playful-hover", "menu-cards", "light-theme", "real-photos"] },
  { name: "Tucson Cleaning Pros", industry: "Cleaning Service", url: "https://tucson-cleaning-pros.vercel.app", style: "V1", colors: ["#111111", "#FFFFFF"], font: "Outfit", description: "Ultra-clean minimal, bubbles, before/after", pages: "multi", features: ["scroll-reveal", "before-after", "marquee"] },
];

export const seedEntries: Entry[] = [
  ...sites.map(s => ({ id: slugOf(s.name), tab: "library" as const, name: s.name, industry: s.industry, url: s.url, colors: s.colors, thumb: null, style: s.style, font: s.font, description: s.description, pages: s.pages, features: s.features })),
  ...hostedSites.map(s => ({ id: slugOf(s.name), tab: "current" as const, name: s.name, industry: s.industry, url: s.url, colors: s.colors, thumb: null, platform: s.platform })),
  ...doProjects.map(s => ({ id: slugOf(s.name), tab: "do" as const, name: s.name, industry: s.industry, url: s.url, colors: s.colors, thumb: null, platform: s.platform })),
];
