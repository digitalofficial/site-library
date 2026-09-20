"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, Grid3X3, List, Search, X, Globe, Layout, Rocket, Clapperboard, Youtube } from "lucide-react";
import Videos from "./Videos";
import { CHANNEL_URL, type Video } from "@/lib/videos";
import { KINDS, KIND_LABEL, KIND_HINT, kindOf, type Entry, type Style, type Platform, type Kind } from "@/lib/types";

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

const cardClass = "group block rounded-2xl overflow-hidden border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20";
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

function HostedRow({ site }: { site: HostedSite }) {
  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
      <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${site.colors[0]}, ${site.colors[1]})` }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${platformBadge(site.platform ?? "Next.js")}`}>{site.platform}</span>
        </div>
        <p className="text-[11px] text-[#888] truncate">{site.industry} · {site.url.replace("https://", "")}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[#888] group-hover:text-[#D77E00] flex-shrink-0 transition-colors" />
    </a>
  );
}

function HostedCard({ site }: { site: HostedSite }) {
  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
      <Preview thumb={site.thumb} colors={site.colors} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${platformBadge(site.platform ?? "Next.js")}`}>{site.platform}</span>
        </div>
        <p className="text-[11px] text-[#888] leading-relaxed">{site.industry}</p>
        <p className="text-[10px] text-[#9a9aa3] mt-1 truncate">{site.url.replace("https://", "")}</p>
      </div>
    </a>
  );
}

function LibraryCard({ site }: { site: Entry }) {
  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
      <Preview thumb={site.thumb} colors={site.colors} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="font-bold text-sm group-hover:text-[#D77E00] transition-colors truncate">{site.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${styleBadge(site.style ?? "V1")}`}>{site.style}</span>
        </div>
        <p className="text-[11px] text-[#888] leading-relaxed">{site.industry} · {site.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className={chipClass}>{site.font}</span>
          <span className={chipClass}>{KIND_LABEL[kindOf(site)]}</span>
        </div>
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
              ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{group.map(renderCard)}</div>
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

function KindSelect({ value, onChange }: { value: Kind | "All"; onChange: (k: Kind | "All") => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as Kind | "All")} aria-label="Kind of site" className="bg-white/[.04] border border-white/[.08] rounded-lg px-2 py-1 text-[10px] sm:text-[11px] text-[#ccc]">
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

export default function Gallery({ entries, videos, featuredVideo }: { entries: Entry[]; videos: Video[]; featuredVideo: string | null }) {
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
  const [search, setSearch] = useState<Record<TopTab, string>>({ library: "", current: "", do: "", videos: "" });
  const [styleFilter, setStyleFilter] = useState<Style | "All">("All");
  const [kindFilter, setKindFilter] = useState<Kind | "All">("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [featureFilter, setFeatureFilter] = useState("All");

  const q = search[topTab];
  const setQ = (v: string) => setSearch(s => ({ ...s, [topTab]: v }));
  const clearFilters = () => { setStyleFilter("All"); setKindFilter("All"); setIndustryFilter("All"); setFeatureFilter("All"); setQ(""); };
  const filtersActive = styleFilter !== "All" || kindFilter !== "All" || industryFilter !== "All" || featureFilter !== "All" || !!q;

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

  return (
    <div className="min-h-[100dvh] bg-[#08080C] text-[#F0F0F2]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#08080C]/80 backdrop-blur-xl border-b border-white/[.06]">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
          {/* Row 1: Title + search/view */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-bold text-base sm:text-lg whitespace-nowrap"><span className="text-[#D77E00]">Digital Official</span> <span className="text-[#888] font-normal text-xs sm:text-sm">Portfolio</span></h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#888]" />
                <input
                  type="text"
                  placeholder="Search"
                  aria-label="Search sites"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  className="pl-8 pr-7 py-1.5 rounded-lg bg-white/[.04] border border-white/[.08] text-[16px] sm:text-xs text-white w-28 sm:w-48 focus:outline-none focus:border-[#D77E00]/40"
                />
                {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2"><X className="h-3 w-3 text-[#888]" /></button>}
              </div>
              {topTab !== "videos" && <div className="flex items-center gap-0.5 bg-white/[.04] border border-white/[.08] rounded-lg p-0.5">
                <button onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`p-1.5 rounded ${view === "grid" ? "bg-white/10 text-[#D77E00]" : "text-[#888]"}`}><Grid3X3 className="h-3.5 w-3.5" /></button>
                <button onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`p-1.5 rounded ${view === "list" ? "bg-white/10 text-[#D77E00]" : "text-[#888]"}`}><List className="h-3.5 w-3.5" /></button>
              </div>}
            </div>
          </div>

          {/* Row 2: Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map(({ id, label, Icon, count }) => (
              <button
                key={id}
                onClick={() => setTopTab(id)}
                aria-pressed={topTab === id}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${topTab === id ? "bg-[#D77E00] text-[#08080C] shadow-lg shadow-[#D77E00]/20" : "bg-white/[.06] text-[#888] hover:text-white hover:bg-white/[.1] border border-white/[.06]"}`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {label}
                <span className={`text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${topTab === id ? "bg-black/20 text-[#08080C]" : "bg-white/[.06] text-[#9a9aa3]"}`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Row 3: Filters (library only) */}
          {topTab === "library" && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] pb-1 -mb-1">
              <div className="flex items-center gap-0.5">
                {(["All", "V1", "V2", "V3", "V4", "V5", "V6"] as const).map(v => (
                  <button key={v} onClick={() => setStyleFilter(v)} className={`px-2 py-1 rounded-full font-semibold transition-all whitespace-nowrap ${styleFilter === v ? "bg-white/[.08] text-[#D77E00]" : "text-[#888] hover:text-white"}`}>
                    {v}{v !== "All" && <span className="text-[#9a9aa3] ml-0.5">{counts[v as Style]}</span>}
                  </button>
                ))}
              </div>
              <span className="text-[#333] hidden sm:inline" aria-hidden>|</span>
              <KindSelect value={kindFilter} onChange={setKindFilter} />
              <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} aria-label="Industry" className="bg-white/[.04] border border-white/[.08] rounded-lg px-2 py-1 text-[10px] sm:text-[11px] text-[#ccc]">
                <option value="All">All Industries</option>
                {allIndustries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <select value={featureFilter} onChange={e => setFeatureFilter(e.target.value)} aria-label="Feature" className="bg-white/[.04] border border-white/[.08] rounded-lg px-2 py-1 text-[10px] sm:text-[11px] text-[#ccc]">
                <option value="All">All Features</option>
                {allFeatures.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              {filtersActive && (
                <button onClick={clearFilters} className="text-[#D77E00] hover:text-white px-2 py-1 whitespace-nowrap">Clear</button>
              )}
            </div>
          )}

          {topTab === "videos" && (
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <p className="text-[#888]">Commercials, brand films and social cuts we produced — synced from our channel.</p>
              <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-[#D77E00] hover:text-white"><Youtube className="h-4 w-4" /> Watch on YouTube</a>
            </div>
          )}
          {(topTab === "current" || topTab === "do") && (
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
              <KindSelect value={kindFilter} onChange={setKindFilter} />
              {topTab === "current" && <p className="text-[#888]">{filteredHosted.length} of {hostedSites.length} live client sites</p>}
              {topTab === "do" && <p className="text-[#888]">Companies we started under Digital Official — our own products.</p>}
              {kindFilter !== "All" && <button onClick={() => setKindFilter("All")} className="text-[#D77E00] hover:text-white px-2 py-1">Clear</button>}
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

        {topTab === "videos" && <Videos videos={videos} featuredId={featuredVideo} query={q} />}

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
