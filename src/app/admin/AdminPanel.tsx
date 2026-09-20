"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowUp, ArrowDown, Camera, Pencil, Trash2, ExternalLink, LogOut, Plus, X } from "lucide-react";
import { TAB_LABEL, TABS, KINDS, KIND_LABEL, KIND_HINT, kindOf, type Entry, type Tab } from "@/lib/types";
import type { Video, VideoSettings } from "@/lib/videos";
import VideosAdmin from "./VideosAdmin";
import { addEntry, deleteEntry, logout, moveEntry, nudgeEntry, recaptureEntry, updateEntry, type ActionResult } from "./actions";

const input = "w-full px-2.5 py-1.5 rounded-lg bg-white/[.04] border border-white/[.1] text-[16px] sm:text-sm text-white focus:outline-none focus:border-[#D77E00]/60";
const label = "block text-[11px] text-[#9a9aa3]";
const btn = "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/[.08] bg-white/[.04] text-[#d0d0d6] hover:bg-white/[.1] hover:text-white disabled:text-[#8a8a92] disabled:hover:bg-white/[.04]";
// Dark text on the accent: white on #D77E00 is only 3.06:1. Pending state keeps full colour and changes the label instead of dimming.
const btnPrimary = "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D77E00] text-[#08080C] hover:bg-[#e58a0a] disabled:cursor-wait";
const btnDanger = "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#ff6b6b]/30 bg-[#ff6b6b]/10 text-[#ff9a9a] hover:bg-[#ff6b6b]/25 hover:text-white";

/** Fields that differ per tab. Shared by the Add and Edit forms. */
function Fields({ tab, e }: { tab: Tab; e?: Entry }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <label className={label}>Name<input name="name" defaultValue={e?.name} required className={input} /></label>
      <label className={label}>URL<input name="url" type="url" defaultValue={e?.url} placeholder="https://" required className={input} /></label>
      <label className={label}>{tab === "library" ? "Industry" : "What it is (one line)"}<input name="industry" defaultValue={e?.industry} className={input} /></label>
      <label className={label}>Kind
        <select name="kind" defaultValue={e ? kindOf(e) : "multi"} className={input}>{KINDS.map(k => <option key={k} value={k}>{KIND_LABEL[k]} — {KIND_HINT[k]}</option>)}</select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={label}>Colour 1<input name="color0" defaultValue={e?.colors[0] ?? "#D77E00"} pattern="#[0-9a-fA-F]{6}" className={input} /></label>
        <label className={label}>Colour 2<input name="color1" defaultValue={e?.colors[1] ?? "#111116"} pattern="#[0-9a-fA-F]{6}" className={input} /></label>
      </div>
      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border border-[#D77E00]/20 p-3">
        <p className="sm:col-span-3 text-[11px] text-[#ffd28a]">Spotlight (optional) — a native app or a one-line brag turns the card orange-ringed with store buttons.</p>
        <label className={label}>App Store URL<input name="appStore" type="url" defaultValue={e?.appStore} placeholder="https://apps.apple.com/…" className={input} /></label>
        <label className={label}>Google Play URL<input name="playStore" type="url" defaultValue={e?.playStore} placeholder="https://play.google.com/…" className={input} /></label>
        <label className={label}>Highlight line<input name="highlight" defaultValue={e?.highlight} placeholder="Booking site + native iOS app" className={input} /></label>
      </div>
      {tab === "library" ? (
        <>
          <label className={label}>Style generation
            <select name="style" defaultValue={e?.style ?? "V5"} className={input}>{["V1","V2","V3","V4","V5","V6"].map(v => <option key={v}>{v}</option>)}</select>
          </label>
          <label className={label}>Font<input name="font" defaultValue={e?.font} className={input} /></label>
          <label className={label}>Features (comma-separated)<input name="features" defaultValue={e?.features?.join(", ")} placeholder="framer-motion, real-photos" className={input} /></label>
          <label className={`${label} sm:col-span-2`}>Description<input name="description" defaultValue={e?.description} className={input} /></label>
        </>
      ) : (
        <label className={label}>Platform
          <select name="platform" defaultValue={e?.platform ?? "Next.js"} className={input}>{["Next.js","Vite","WordPress"].map(v => <option key={v}>{v}</option>)}</select>
        </label>
      )}
    </div>
  );
}

function SubmitButton({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={btnPrimary}>{pending ? pendingText : children}</button>;
}

function Notice({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return result.ok
    ? (result.message ? <p role="status" className="text-xs text-[#ffd28a]">{result.message}</p> : null)
    : <p role="alert" className="text-xs text-[#ff9a9a]">{result.error}</p>;
}

function Row({ e, first, last, onNotice }: { e: Entry; first: boolean; last: boolean; onNotice: (r: ActionResult) => void }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, start] = useTransition();
  const [editState, editAction] = useFormState(updateEntry, null);
  const run = (fn: () => Promise<ActionResult>) => start(async () => { onNotice(await fn()); });
  // Close the editor only once the server accepted the change; errors stay inline.
  useEffect(() => { if (editState?.ok) setEditing(false); }, [editState]);

  return (
    <li className="rounded-xl border border-white/[.06] bg-[#111116] p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-16 h-10 rounded-md overflow-hidden flex-shrink-0 relative" style={{ background: `linear-gradient(135deg, ${e.colors[0]}, ${e.colors[1]})` }}>
          {e.thumb && <img src={e.thumb} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{e.name} <span className="font-normal text-[#9a9aa3]">· {e.tab === "library" ? e.style : e.platform} · {KIND_LABEL[kindOf(e)]}</span></p>
          <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#9a9aa3] hover:text-[#D77E00] truncate inline-flex items-center gap-1">{e.url.replace("https://", "")} <ExternalLink className="h-3 w-3" /></a>
        </div>
        <div className="hidden sm:flex flex-col gap-0.5">
          <button aria-label="Move up" disabled={first || pending} onClick={() => run(() => nudgeEntry(e.id, -1))} className={btn}><ArrowUp className="h-3 w-3" /></button>
          <button aria-label="Move down" disabled={last || pending} onClick={() => run(() => nudgeEntry(e.id, 1))} className={btn}><ArrowDown className="h-3 w-3" /></button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <label className="inline-flex items-center gap-1 text-xs text-[#9a9aa3]">Move to
          <select value={e.tab} disabled={pending} onChange={ev => run(() => moveEntry(e.id, ev.target.value as Tab))} className="px-2 py-1.5 rounded-lg bg-white/[.04] border border-white/[.1] text-xs text-white">
            {TABS.map(t => <option key={t} value={t}>{TAB_LABEL[t]}</option>)}
          </select>
        </label>
        <span className="sm:hidden inline-flex gap-1">
          <button aria-label="Move up" disabled={first || pending} onClick={() => run(() => nudgeEntry(e.id, -1))} className={btn}><ArrowUp className="h-3 w-3" /></button>
          <button aria-label="Move down" disabled={last || pending} onClick={() => run(() => nudgeEntry(e.id, 1))} className={btn}><ArrowDown className="h-3 w-3" /></button>
        </span>
        <button disabled={pending} onClick={() => setEditing(v => !v)} className={btn}><Pencil className="h-3 w-3" /> {editing ? "Close" : "Edit"}</button>
        <button disabled={pending} onClick={() => run(() => recaptureEntry(e.id))} className={btn}><Camera className="h-3 w-3" /> {pending ? "Working…" : "Recapture"}</button>
        {confirmDelete ? (
          <span className="inline-flex items-center gap-1">
            <button disabled={pending} onClick={() => run(async () => { const r = await deleteEntry(e.id); setConfirmDelete(false); return r; })} className={btnDanger}>Yes, delete {e.name}</button>
            <button onClick={() => setConfirmDelete(false)} className={btn}><X className="h-3 w-3" /></button>
          </span>
        ) : (
          <button disabled={pending} onClick={() => setConfirmDelete(true)} className={btnDanger}><Trash2 className="h-3 w-3" /> Delete</button>
        )}
      </div>
      {editing && (
        <form action={editAction} className="space-y-3 pt-3 border-t border-white/[.06]">
          <input type="hidden" name="id" value={e.id} />
          <Fields tab={e.tab} e={e} />
          <div className="flex items-center gap-2">
            <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
            <Notice result={editState} />
          </div>
        </form>
      )}
    </li>
  );
}

function AddForm({ tab, onNotice }: { tab: Tab; onNotice: (r: ActionResult) => void }) {
  const [state, action] = useFormState(addEntry, null);
  const [open, setOpen] = useState(false);
  // A successful save closes the form (the new row appears below); errors stay inline.
  useEffect(() => { if (state?.ok) { setOpen(false); onNotice(state); } }, [state, onNotice]);
  if (!open) return <button onClick={() => setOpen(true)} className={btnPrimary}><Plus className="h-3.5 w-3.5" /> Add to {TAB_LABEL[tab]}</button>;
  return (
    <form action={action} key={tab} className="rounded-xl border border-[#D77E00]/30 bg-[#111116] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm">Add to {TAB_LABEL[tab]}</h2>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className={btn}><X className="h-3 w-3" /></button>
      </div>
      <input type="hidden" name="tab" value={tab} />
      <Fields tab={tab} />
      <div className="flex flex-wrap items-center gap-2">
        <SubmitButton pendingText="Capturing thumbnail… (up to 30s)">Save + capture thumbnail</SubmitButton>
        <Notice result={state} />
      </div>
    </form>
  );
}

export default function AdminPanel({ entries, source, videos, videoSettings, videoSource }: { entries: Entry[]; source: "blob" | "seed"; videos: Video[]; videoSettings: VideoSettings; videoSource: "live" | "partial" | "none" }) {
  const [tab, setTab] = useState<Tab | "videos">("library");
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const rows = entries.filter(e => e.tab === tab);
  const addTab: Tab = tab === "videos" ? "library" : tab;

  return (
    <main className="min-h-[100dvh] bg-[#08080C] text-[#F0F0F2]">
      <header className="sticky top-0 z-40 bg-[#08080C]/85 backdrop-blur-xl border-b border-white/[.06]">
        <div className="max-w-4xl mx-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-bold text-base sm:text-lg whitespace-nowrap"><span className="text-[#D77E00]">Digital Official</span> <span className="text-[#9a9aa3] font-normal text-xs sm:text-sm hidden sm:inline">Portfolio admin</span></h1>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <a href="/" target="_blank" rel="noopener" className={btn}><ExternalLink className="h-3 w-3" /> Site</a>
              <form action={logout}><button className={btn}><LogOut className="h-3 w-3" /> Sign out</button></form>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[...TABS, "videos" as const].map(t => (
              <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t} className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${tab === t ? "bg-[#D77E00] text-[#08080C]" : "bg-white/[.06] text-[#9a9aa3] hover:text-white border border-white/[.06]"}`}>
                {t === "videos" ? "Videos" : TAB_LABEL[t]} <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${tab === t ? "bg-black/20" : "bg-white/[.06]"}`}>{t === "videos" ? videos.length : entries.filter(e => e.tab === t).length}</span>
              </button>
            ))}
          </div>
          {source === "seed" && <p role="alert" className="text-xs text-[#ff9a9a]">Showing the built-in seed list — Blob is empty or unreachable. Run <code>npm run seed</code> before editing.</p>}
          <Notice result={notice} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {tab === "videos" ? <VideosAdmin videos={videos} settings={videoSettings} source={videoSource} onNotice={setNotice} /> : (<>
        <AddForm tab={addTab} onNotice={setNotice} />
        <ul className="space-y-2">
          {rows.map((e, i) => <Row key={e.id} e={e} first={i === 0} last={i === rows.length - 1} onNotice={setNotice} />)}
        </ul>
        {rows.length === 0 && <p className="text-sm text-[#9a9aa3] text-center py-10">Nothing in {TAB_LABEL[addTab]} yet.</p>}
        </>)}
        <p className="text-[11px] text-[#8a8a92] text-center pb-6">Order here is the order on the site. Changes are live immediately.</p>
      </div>
    </main>
  );
}
