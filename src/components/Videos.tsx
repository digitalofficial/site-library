"use client";

import { useEffect, useState } from "react";
import { Play, X, ExternalLink, Youtube } from "lucide-react";
import { CHANNEL_URL, thumbOf, watchUrl, type Video } from "@/lib/videos";

const fmtViews = (n?: number) => n == null ? null : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M views` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K views` : `${n} views`;
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null;

/** Privacy-enhanced embed; autoplay only when opened by a tap. */
function Player({ id, title }: { id: string; title: string }) {
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
    />
  );
}

function Thumb({ v, big = false, poster }: { v: Video; big?: boolean; poster?: string }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-[#08080C]">
      {/* hqdefault is 4:3 with letterbox bars; cover-cropping to 16:9 removes them. The hero gets a server-resolved larger poster. */}
      <img src={poster ?? thumbOf(v.id)} alt="" loading={big ? "eager" : "lazy"} decoding="async" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`flex items-center justify-center rounded-full bg-[#D77E00] text-[#08080C] shadow-lg shadow-black/40 group-hover:scale-110 transition-transform ${big ? "h-16 w-16 sm:h-20 sm:w-20" : "h-11 w-11"}`}>
          <Play className={big ? "h-7 w-7 sm:h-9 sm:w-9 ml-1" : "h-5 w-5 ml-0.5"} fill="currentColor" />
        </span>
      </div>
    </div>
  );
}

export default function Videos({ videos, featuredId, heroPoster, query }: { videos: Video[]; featuredId: string | null; heroPoster?: string; query: string }) {
  const [open, setOpen] = useState<Video | null>(null);
  const [heroPlaying, setHeroPlaying] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  const q = query.toLowerCase();
  const list = q ? videos.filter(v => v.title.toLowerCase().includes(q)) : videos;
  const hero = !q ? (videos.find(v => v.id === featuredId) ?? videos[0]) : null;
  const rest = hero ? list.filter(v => v.id !== hero.id) : list;

  return (
    <>
      {hero && (
        <section aria-label="Featured video" className="mb-8">
          <div className="group rounded-2xl overflow-hidden border border-white/[.06] bg-[#111116]">
            <div className="relative aspect-video">
              {heroPlaying ? <Player id={hero.id} title={hero.title} /> : (
                <button onClick={() => setHeroPlaying(true)} aria-label={`Play ${hero.title}`} className="absolute inset-0 w-full h-full text-left">
                  <Thumb v={hero} big poster={heroPoster} />
                </button>
              )}
            </div>
            <div className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#D77E00] mb-1">Featured</p>
                <h2 className="font-bold text-base sm:text-lg leading-snug">{hero.title}</h2>
                <p className="text-[11px] text-[#9a9aa3] mt-1">{[fmtDate(hero.published), fmtViews(hero.views)].filter(Boolean).join(" · ")}</p>
              </div>
              <a href={watchUrl(hero.id)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d0d0d6] hover:text-white border border-white/[.08] bg-white/[.04] px-3 py-2 rounded-lg whitespace-nowrap">Watch on YouTube <ExternalLink className="h-3 w-3" /></a>
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {rest.map(v => (
            <button key={v.id} onClick={() => setOpen(v)} className="group text-left rounded-2xl overflow-hidden border border-white/[.06] bg-[#111116] hover:border-white/[.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
              <Thumb v={v} />
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-[13px] sm:text-sm leading-snug line-clamp-2 group-hover:text-[#D77E00] transition-colors">{v.title}</h3>
                <p className="text-[11px] text-[#9a9aa3] mt-1">{[fmtDate(v.published), fmtViews(v.views)].filter(Boolean).join(" · ") || "YouTube"}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {list.length === 0 && <p className="text-center py-20 text-sm text-[#9a9aa3]">No videos match your search.</p>}

      <div className="text-center py-10 text-xs text-[#8a8a92]">
        <p>{videos.length} videos</p>
        <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[#D77E00] hover:text-white"><Youtube className="h-4 w-4" /> Subscribe on YouTube</a>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={open.title} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-8" onClick={() => setOpen(null)}>
          <div className="w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="font-bold text-sm sm:text-base text-white truncate">{open.title}</p>
              <button onClick={() => setOpen(null)} aria-label="Close" className="flex-shrink-0 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"><X className="h-4 w-4" /></button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black"><Player id={open.id} title={open.title} /></div>
            <a href={watchUrl(open.id)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-[#d0d0d6] hover:text-white">Open on YouTube <ExternalLink className="h-3 w-3" /></a>
          </div>
        </div>
      )}
    </>
  );
}
