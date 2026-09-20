"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, Grid3X3, List, Search, X, Globe, Layout, Rocket, Clapperboard, Youtube, Smartphone, Sparkles, SlidersHorizontal } from "lucide-react";
import Videos from "./Videos";
import { CHANNEL_URL, type Video } from "@/lib/videos";
import { KINDS, KIND_LABEL, KIND_HINT, kindOf, isSpotlight, type Entry, type Style, type Platform, type Kind } from "@/lib/types";

type TopTab = "library" | "current" | "do" | "videos";
type View = "grid" | "list";
type HostedSite = Entry;

const styleBadge = (s: Style) =>
  s === "V1" ? "bg-blue-500/15 text-blue-300 border-blue-500/20" :
  s === "V2" ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/20" :
  s === "V3" ? "bg-purple-500/15 text-purple-300 border-purple-500/20" :
  s === "V4" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" :
  s === "V5" ? "bg-rose-500/15 text-rose-300 border-rose-500/20" :
  "bg-orange-500/15 text-orange-300 border-orange-500/20";

const platformBadge = (p: Platform) =>
  p === "Vite" ? "bg-purple-500/15 text-purple-300 border-purple-500/20" :
  p === "Next.js" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" :
  "bg-blue-500/15 text-blue-300 border-blue-500/20";


const matches = (q: string, ...fields: string[]) =>
  !q || fields.some(f => f.toLowerCase().includes(q.toLowerCase()));

/** Static screenshot from public/thumbs (see scripts/thumbs.mjs). Falls back to the brand gradient if none was rendered. */
function Thumb({ thumb, colors }: { thumb: string | null; colors: [string, string] }) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}55)` }}>
      {thumb && !missing && (
        <img
          src={thumb}
          alt=""
          width={640}
          height={400}
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      )}
      {(!thumb || missing) && <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white/60">Preview coming soon</span>}
    </div>
  );
}

const cardClass = "group block [content-visibility:auto] [contain-intrinsic-size:auto_320px] rounded-2xl overflow-hidden border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20";
const rowClass = "group flex items-center gap-4 p-3 rounded-xl border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all";
const chipClass = "text-[10px] text-[#9a9aa3] bg-white/[.03] px-1.5 py-0.5 rounded";

function Preview({ thumb, colors }: { thumb: string | null; colors: [string, string] }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-[#08080C]">
      <Thumb thumb={thumb} colors={colors} />
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }} />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">Visit <ArrowUpRight className="h-3 w-3" /></span>
      </div>
    </div>
  );
}


/** The extra strip on a spotlight card: app icon + store buttons + brag line. Rendered inside the card link, so buttons are spans styled as buttons. */
function Spotlight({ e }: { e: Entry }) {
  if (!isSpotlight(e)) return null;
  return (
    <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-[#D77E00]/20 flex items-center gap-2 sm:gap-3">
      {e.appIcon && <img src={e.appIcon} alt="" width={44} height={44} className="h-9 w-9 sm:h-11 sm:w-11 rounded-[10px] flex-shrink-0 shadow-md shadow-black/40" />}
      <div className="min-w-0 flex-1">
        {e.highlight && <p className="text-[11px] font-semibold text-[#ffd28a] leading-snug line-clamp-2 sm:line-clamp-none"><Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />{e.highlight}</p>}
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {e.appStore && <span onClick={ev => { ev.preventDefault(); ev.stopPropagation(); window.open(e.appStore, "_blank", "noopener"); }} role="link" tabIndex={0} onKeyDown={ev => { if (ev.key === "Enter") { ev.preventDefault(); window.open(e.appStore, "_blank", "noopener"); } }} className="inline-flex items-center gap-1 rounded-md bg-white text-[#08080C] text-[10px] font-bold px-2 py-1 hover:bg-[#ffd28a]"><Smartphone className="h-3 w-3" /> App Store</span>}
          {e.playStore && <span onClick={ev => { ev.preventDefault(); ev.stopPropagation(); window.open(e.playStore, "_blank", "noopener"); }} role="link" tabIndex={0} onKeyDown={ev => { if (ev.key === "Enter") { ev.preventDefault(); window.open(e.playStore, "_blank", "noopener"); } }} className="inline-flex items-center gap-1 rounded-md bg-white text-[#08080C] text-[10px] font-bold px-2 py-1 hover:bg-[#ffd28a]"><Smartphone className="h-3 w-3" /> Google Play</span>}
        </div>
      </div>
    </div>
  );
}

// spotlight cards also take the full row on phones so the app strip has room
const spotClass = (e: Entry) => isSpotlight(e) ? " col-span-2 sm:col-span-1 border-[#D77E00]/40 shadow-[0_0_0_1px_rgba(215,126,0,.25),0_12px_40px_-12px_rgba(215,126,0,.35)]" : "";

/** Small corner ribbon so the spotlight reads even before the card is scrolled into view. */
function AppRibbon({ e }: { e: Entry }) {
  if (!e.appStore && !e.playStore) return null;
  return <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#D77E00] text-[#08080C] text-[10px] font-bold px-2 py-1 shadow-lg shadow-black/40"><Smartphone className="h-3 w-3" /> Native app</span>;
}

function HostedRow({ site }: { site: HostedSite }) {
  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
      <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${site.colors[0]}, ${site.colors[1]})` }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${platformBadge(site.platform ?? "Next.js")}`}>{site.platform}</span>
          {(site.appStore || site.playStore) && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D77E00] text-[#08080C] flex-shrink-0"><Smartphone className="h-3 w-3" /> App</span>}
        </div>
        <p className="text-[11px] text-[#888] truncate">{site.industry} · {site.url.replace("https://", "")}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[#888] group-hover:text-[#D77E00] flex-shrink-0 transition-colors" />
    </a>
  );
}

function HostedCard({ site }: { site: HostedSite }) {
  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer" className={cardClass + spotClass(site) + " relative"}>
      <AppRibbon e={site} />
      <Preview thumb={site.thumb} colors={site.colors} />
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <h2 className="font-bold text-[13px] sm:text-sm leading-snug group-hover:text-[#D77E00] transition-colors line-clamp-2 sm:line-clamp-none sm:truncate">{site.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${platformBadge(site.platform ?? "Next.js")}`}>{site.platform}</span>
        </div>
        <p className="text-[11px] text-[#888] leading-snug line-clamp-1 sm:line-clamp-none">{site.industry}</p>
        <p className="text-[10px] text-[#9a9aa3] mt-1 truncate hidden sm:block">{site.url.replace("https://", "")}</p>
        <Spotlight e={site} />
      </div>
    </a>
  );
}

function LibraryCard({ site }: { site: Entry }) {
  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer" className={cardClass + spotClass(site) + " relative"}>
      <AppRibbon e={site} />
      <Preview thumb={site.thumb} colors={site.colors} />
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <h2 className="font-bold text-[13px] sm:text-sm leading-snug group-hover:text-[#D77E00] transition-colors line-clamp-2 sm:line-clamp-none sm:truncate">{site.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${styleBadge(site.style ?? "V1")}`}>{site.style}</span>
        </div>
        <p className="text-[11px] text-[#888] leading-snug line-clamp-1 sm:line-clamp-none">{site.industry} · {site.description}</p>
        <div className="hidden sm:flex flex-wrap gap-1 mt-2">
          <span className={chipClass}>{site.font}</span>
          <span className={chipClass}>{KIND_LABEL[kindOf(site)]}</span>
        </div>
        <Spotlight e={site} />
      </div>
    </a>
  );
}

function LibraryRow({ site }: { site: Entry }) {
  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
      <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${site.colors[0]}, ${site.colors[1]})` }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${styleBadge(site.style ?? "V1")}`}>{site.style}</span>
        </div>
        <p className="text-[11px] text-[#888] truncate">{site.industry} · {site.description}</p>
      </div>
      <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px]">
        {(site.features ?? []).slice(0, 3).map(f => <span key={f} className={chipClass}>{f}</span>)}
      </div>
      <ArrowUpRight className="h-4 w-4 text-[#888] group-hover:text-[#D77E00] flex-shrink-0 transition-colors" />
    </a>
  );
}

/** Groups a tab's items by kind (Ecommerce → Business Suite → Single → Multi), one heading per non-empty group. */
function Sections({ items, view, renderCard, renderRow }: { items: Entry[]; view: View; renderCard: (e: Entry) => React.ReactNode; renderRow: (e: Entry) => React.ReactNode }) {
  return (
    <div className="space-y-8">
      {KINDS.map(k => {
        const group = items.filter(e => kindOf(e) === k);
        if (!group.length) return null;
        return (
          <section key={k} aria-labelledby={`kind-${k}`}>
            <div className="flex items-baseline gap-2 mb-3">
              <h2 id={`kind-${k}`} className="font-bold text-sm sm:text-base">{KIND_LABEL[k]}</h2>
              <span className="text-[11px] text-[#9a9aa3]">{group.length} · {KIND_HINT[k]}</span>
            </div>
            {view === "grid"
              ? <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">{group.map(renderCard)}</div>
              : <div className="space-y-2">{group.map(renderRow)}</div>}
          </section>
        );
      })}
    </div>
  );
}

function HostedList({ items, view }: { items: HostedSite[]; view: View }) {
  return <Sections items={items} view={view} renderCard={s => <HostedCard key={s.url} site={s} />} renderRow={s => <HostedRow key={s.url} site={s} />} />;
}

// 36px tall on phones (tap target), compact on desktop
const selectClass = "h-9 sm:h-7 bg-white/[.04] border border-white/[.08] rounded-lg px-2 text-[11px] text-[#ccc] max-w-[46vw] sm:max-w-none";

function KindSelect({ value, onChange }: { value: Kind | "All"; onChange: (k: Kind | "All") => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as Kind | "All")} aria-label="Kind of site" className={selectClass}>
      <option value="All">All kinds</option>
      {KINDS.map(k => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
    </select>
  );
}

function Empty({ onClear, label }: { onClear: () => void; label: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-[#888] text-sm">No sites match your {label}.</p>
      <button onClick={onClear} className="mt-3 text-[#D77E00] text-sm hover:text-white">Clear {label}</button>
    </div>
  );
}

export default function Gallery({ entries, videos, featuredVideo, heroPoster }: { entries: Entry[]; videos: Video[]; featuredVideo: string | null; heroPoster?: string }) {
  const sites = useMemo(() => entries.filter(e => e.tab === "library"), [entries]);
  const hostedSites = useMemo(() => entries.filter(e => e.tab === "current"), [entries]);
  const doProjects = useMemo(() => entries.filter(e => e.tab === "do"), [entries]);
  const allIndustries = useMemo(() => [...new Set(sites.map(s => s.industry))].sort(), [sites]);
  const allFeatures = useMemo(() => [...new Set(sites.flatMap(s => s.features ?? []))].sort(), [sites]);
  const TABS: { id: TopTab; label: string; Icon: typeof Layout; count: number }[] = [
    { id: "library", label: "Library", Icon: Layout, count: sites.length },
    { id: "current", label: "Current", Icon: Globe, count: hostedSites.length },
    { id: "do", label: "DO Projects", Icon: Rocket, count: doProjects.length },
    { id: "videos", label: "Videos", Icon: Clapperboard, count: videos.length },
  ];
  const [topTab, setTopTab] = useState<TopTab>("library");
  const [view, setView] = useState<View>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState<Record<TopTab, string>>({ library: "", current: "", do: "", videos: "" });
  const [styleFilter, setStyleFilter] = useState<Style | "All">("All");
  const [kindFilter, setKindFilter] = useState<Kind | "All">("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [featureFilter, setFeatureFilter] = useState("All");

  const q = search[topTab];
  const setQ = (v: string) => setSearch(s => ({ ...s, [topTab]: v }));
  const clearFilters = () => { setStyleFilter("All"); setKindFilter("All"); setIndustryFilter("All"); setFeatureFilter("All"); setQ(""); };
  const filtersActive = styleFilter !== "All" || kindFilter !== "All" || industryFilter !== "All" || featureFilter !== "All" || !!q;
  const activeFilterCount = [styleFilter, kindFilter, industryFilter, featureFilter].filter(f => f !== "All").length;

  const filtered = useMemo(() => sites.filter(s =>
    (styleFilter === "All" || s.style === styleFilter) &&
    (kindFilter === "All" || kindOf(s) === kindFilter) &&
    (industryFilter === "All" || s.industry === industryFilter) &&
    (featureFilter === "All" || (s.features ?? []).includes(featureFilter)) &&
    matches(q, s.name, s.industry)
  ), [sites, styleFilter, kindFilter, industryFilter, featureFilter, q]);

  const filteredHosted = useMemo(() => hostedSites.filter(s => (kindFilter === "All" || kindOf(s) === kindFilter) && matches(q, s.name, s.industry)), [hostedSites, kindFilter, q]);
  const filteredDo = useMemo(() => doProjects.filter(s => (kindFilter === "All" || kindOf(s) === kindFilter) && matches(q, s.name, s.industry)), [doProjects, kindFilter, q]);

  const counts = Object.fromEntries((["V1","V2","V3","V4","V5","V6"] as const).map(v => [v, sites.filter(s => s.style === v).length])) as Record<Style, number>;

  // Same controls in the desktop row and the phone panel.
  const LibraryFilters = () => (
    <>
      <div className="flex items-center gap-1 overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(["All", "V1", "V2", "V3", "V4", "V5", "V6"] as const).map(v => (
          <button key={v} onClick={() => setStyleFilter(v)} className={`flex-shrink-0 h-9 sm:h-7 px-3 sm:px-2 rounded-full font-semibold transition-all whitespace-nowrap ${styleFilter === v ? "bg-white/[.08] text-[#D77E00]" : "text-[#9a9aa3] hover:text-white"}`}>
            {v}{v !== "All" && <span className="text-[#8a8a92] ml-0.5">{counts[v as Style]}</span>}
          </button>
        ))}
      </div>
      <span className="text-[#333] hidden sm:inline" aria-hidden>|</span>
      <KindSelect value={kindFilter} onChange={setKindFilter} />
      <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} aria-label="Industry" className={selectClass}>
        <option value="All">All Industries</option>
        {allIndustries.map(i => <option key={i} value={i}>{i}</option>)}
      </select>
      <select value={featureFilter} onChange={e => setFeatureFilter(e.target.value)} aria-label="Feature" className={selectClass}>
        <option value="All">All Features</option>
        {allFeatures.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      {filtersActive && <button onClick={clearFilters} className="h-9 sm:h-7 px-3 rounded-lg text-[#D77E00] hover:text-white whitespace-nowrap font-semibold">Clear</button>}
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-[#08080C] text-[#F0F0F2]">

      {/* Header: brand + search · four glass tiles · filters + view toggle. Sticky, compact on phones. */}
      <header className="sticky top-0 z-50 bg-[#08080C]/85 backdrop-blur-xl border-b border-white/[.06]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 space-y-2.5 sm:space-y-3">
          {/* Row 1: brand · search */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-bold text-base sm:text-lg whitespace-nowrap flex-shrink-0"><span className="text-[#D77E00]">Digital Official</span> <span className="text-[#888] font-normal text-xs sm:text-sm">Portfolio</span></h1>
            <div className="relative flex-1 max-w-[220px] sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888] pointer-events-none" />
              <input type="search" placeholder="Search" aria-label="Search" value={q} onChange={e => setQ(e.target.value)} className="w-full h-10 sm:h-9 pl-9 pr-9 rounded-xl bg-white/[.05] border border-white/[.1] text-[16px] sm:text-sm text-white placeholder:text-[#9a9aa3] focus:outline-none focus:border-[#D77E00]/50 [&::-webkit-search-cancel-button]:hidden" />
              {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-0 top-0 h-10 sm:h-9 w-9 inline-flex items-center justify-center text-[#9a9aa3] hover:text-white"><X className="h-4 w-4" /></button>}
            </div>
          </div>

          {/* Row 2: the four tiles — edge to edge on phones, left-aligned squares on desktop */}
          <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3" role="tablist" aria-label="Sections">
            {TABS.map(({ id, label, Icon, count }) => {
              const active = topTab === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTopTab(id)}
                  className={`relative isolate overflow-hidden rounded-2xl aspect-square sm:aspect-auto sm:w-[136px] sm:h-[92px] flex flex-col items-center justify-center gap-1.5 backdrop-blur-xl border transition-all duration-300
                    before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(255,255,255,.16),transparent_60%)]
                    ${active
                      ? "bg-[#D77E00]/20 border-[#D77E00]/60 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_0_0_1px_rgba(215,126,0,.25),0_14px_40px_-16px_rgba(215,126,0,.7)]"
                      : "bg-white/[.06] border-white/[.12] text-[#d0d0d6] hover:bg-white/[.1] hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_10px_30px_-18px_rgba(0,0,0,.9)]"}`}
                >
                  <span className={`absolute top-1.5 right-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? "bg-[#D77E00] text-[#08080C]" : "bg-white/[.08] text-[#9a9aa3]"}`}>{count}</span>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${active ? "text-[#D77E00]" : ""}`} />
                  <span className="text-[11px] sm:text-xs font-bold leading-none">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Row 3: filters on the left, view toggle on the right */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              {topTab === "library" && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setFiltersOpen(o => !o)} aria-expanded={filtersOpen} className={`sm:hidden h-10 px-3 inline-flex items-center gap-1.5 rounded-xl border text-xs font-semibold ${filtersOpen || filtersActive ? "bg-white/10 border-[#D77E00]/40 text-[#D77E00]" : "bg-white/[.05] border-white/[.1] text-[#d0d0d6]"}`}>
                    <SlidersHorizontal className="h-4 w-4" /> Filters{activeFilterCount > 0 && <span className="ml-0.5 rounded-md bg-[#D77E00] text-[#08080C] px-1.5 text-[10px] leading-4">{activeFilterCount}</span>}
                  </button>
                  <p className="sm:hidden text-[11px] text-[#888] truncate">{filtered.length} of {sites.length}</p>
                  <div className="hidden sm:flex flex-wrap items-center gap-2 text-[11px]">
                    <LibraryFilters />
                  </div>
                </div>
              )}
              {(topTab === "current" || topTab === "do") && (
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <KindSelect value={kindFilter} onChange={setKindFilter} />
                  <p className="text-[#888] truncate">{topTab === "current" ? `${filteredHosted.length} of ${hostedSites.length} live client sites` : "Our own companies"}</p>
                  {kindFilter !== "All" && <button onClick={() => setKindFilter("All")} className="h-10 sm:h-7 px-2 text-[#D77E00] hover:text-white font-semibold">Clear</button>}
                </div>
              )}
              {topTab === "videos" && (
                <div className="flex items-center gap-3 text-[11px]">
                  <p className="text-[#888] hidden sm:block">Commercials, brand films and social cuts — synced from our channel.</p>
                  <p className="text-[#888] sm:hidden">{videos.length} videos from our channel</p>
                </div>
              )}
            </div>
            {topTab !== "videos" ? (
              <div className="flex items-center gap-0.5 bg-white/[.05] border border-white/[.1] rounded-xl p-0.5 flex-shrink-0">
                <button onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`h-9 w-10 sm:h-7 sm:w-8 inline-flex items-center justify-center rounded-lg ${view === "grid" ? "bg-[#D77E00] text-[#08080C]" : "text-[#9a9aa3] hover:text-white"}`}><Grid3X3 className="h-4 w-4 sm:h-3.5 sm:w-3.5" /></button>
                <button onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`h-9 w-10 sm:h-7 sm:w-8 inline-flex items-center justify-center rounded-lg ${view === "list" ? "bg-[#D77E00] text-[#08080C]" : "text-[#9a9aa3] hover:text-white"}`}><List className="h-4 w-4 sm:h-3.5 sm:w-3.5" /></button>
              </div>
            ) : (
              <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 h-10 sm:h-9 px-3 rounded-xl border border-white/[.1] bg-white/[.05] text-xs font-semibold text-[#D77E00] hover:text-white whitespace-nowrap flex-shrink-0"><Youtube className="h-4 w-4" /> YouTube</a>
            )}
          </div>

          {/* phone-only filter panel */}
          {topTab === "library" && filtersOpen && (
            <div className="sm:hidden flex flex-wrap items-center gap-2 text-[11px] pb-1">
              <LibraryFilters />
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {topTab === "current" && (
          <>
            <HostedList items={filteredHosted} view={view} />
            {filteredHosted.length === 0 && <Empty label="search" onClear={() => setQ("")} />}
            <div className="text-center py-10 text-xs text-[#8a8a92]">
              <p>{hostedSites.length} live sites · {hostedSites.filter(s => s.platform === "Vite").length} Vite · {hostedSites.filter(s => s.platform === "Next.js").length} Next.js · {hostedSites.filter(s => s.platform === "WordPress").length} WordPress</p>
              <p className="mt-1">Hosted by <span className="text-[#D77E00]">Digital Official</span></p>
            </div>
          </>
        )}

        {topTab === "do" && (
          <>
            <HostedList items={filteredDo} view={view} />
            {filteredDo.length === 0 && <Empty label="search" onClear={() => setQ("")} />}
            <div className="text-center py-10 text-xs text-[#8a8a92]">
              <p>{doProjects.length} products</p>
              <p className="mt-1">Founded by <span className="text-[#D77E00]">Digital Official</span></p>
            </div>
          </>
        )}

        {topTab === "videos" && <Videos videos={videos} featuredId={featuredVideo} heroPoster={heroPoster} query={q} />}

        {topTab === "library" && (
          <>
            <Sections items={filtered} view={view} renderCard={s => <LibraryCard key={s.url} site={s} />} renderRow={s => <LibraryRow key={s.url} site={s} />} />

            {filtered.length === 0 && <Empty label="filters" onClear={clearFilters} />}

            <div className="text-center py-10 text-xs text-[#8a8a92]">
              <p>{sites.length} templates · 6 style generations · {new Set(sites.map(s => s.font)).size} fonts · {allIndustries.length} industries</p>
              <p className="mt-1">Built by <span className="text-[#D77E00]">Digital Official</span></p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
