"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Star, EyeOff, Eye, Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { thumbOf, watchUrl, CHANNEL_URL, type Video, type VideoSettings } from "@/lib/videos";
import { addVideo, featureVideo, removeVideo, renameVideo, toggleHiddenVideo, type ActionResult } from "./actions";

const btn = "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/[.08] bg-white/[.04] text-[#d0d0d6] hover:bg-white/[.1] hover:text-white disabled:text-[#8a8a92]";
const btnPrimary = "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D77E00] text-[#08080C] hover:bg-[#e58a0a] disabled:cursor-wait";
const input = "w-full px-2.5 py-1.5 rounded-lg bg-white/[.04] border border-white/[.1] text-[16px] sm:text-sm text-white focus:outline-none focus:border-[#D77E00]/60";

function Submit({ children, pendingText }: { children: React.ReactNode; pendingText: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={btnPrimary}>{pending ? pendingText : children}</button>;
}

function Row({ v, settings, onNotice }: { v: Video; settings: VideoSettings; onNotice: (r: ActionResult) => void }) {
  const [pending, start] = useTransition();
  const [renaming, setRenaming] = useState(false);
  const [state, action] = useFormState(renameVideo, null);
  const run = (fn: () => Promise<ActionResult>) => start(async () => onNotice(await fn()));
  const hidden = settings.hidden.includes(v.id), featured = settings.featured === v.id;
  return (
    <li className={`rounded-xl border p-3 space-y-2 ${hidden ? "border-white/[.04] bg-[#0d0d11] opacity-70" : "border-white/[.06] bg-[#111116]"}`}>
      <div className="flex items-center gap-3">
        <img src={thumbOf(v.id)} alt="" className="w-20 h-11 rounded-md object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{v.title} {featured && <span className="text-[#D77E00] font-normal">· Featured</span>}{hidden && <span className="text-[#9a9aa3] font-normal">· Hidden</span>}</p>
          <a href={watchUrl(v.id)} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#9a9aa3] hover:text-[#D77E00] inline-flex items-center gap-1">{v.published?.slice(0, 10) ?? "date unknown"} · {v.id} <ExternalLink className="h-3 w-3" /></a>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button disabled={pending} onClick={() => run(() => featureVideo(featured ? null : v.id))} className={btn}><Star className="h-3 w-3" fill={featured ? "currentColor" : "none"} /> {featured ? "Unfeature" : "Feature"}</button>
        <button disabled={pending} onClick={() => run(() => toggleHiddenVideo(v.id))} className={btn}>{hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {hidden ? "Show" : "Hide"}</button>
        <button disabled={pending} onClick={() => setRenaming(r => !r)} className={btn}><Pencil className="h-3 w-3" /> Rename</button>
        {v.manual && <button disabled={pending} onClick={() => run(() => removeVideo(v.id))} className={`${btn} text-[#ff9a9a]`}><Trash2 className="h-3 w-3" /> Remove</button>}
      </div>
      {renaming && (
        <form action={action} onSubmit={() => setTimeout(() => setRenaming(false), 400)} className="flex flex-wrap items-end gap-2 pt-2 border-t border-white/[.06]">
          <input type="hidden" name="id" value={v.id} />
          <label className="flex-1 min-w-[200px] text-[11px] text-[#9a9aa3]">Title on the portfolio (blank = YouTube's)
            <input name="title" defaultValue={settings.titles[v.id] ?? v.title} className={input} />
          </label>
          <Submit pendingText="Saving…">Save</Submit>
          {state && !state.ok && <p role="alert" className="text-xs text-[#ff9a9a]">{state.error}</p>}
        </form>
      )}
    </li>
  );
}

export default function VideosAdmin({ videos, settings, source, onNotice }: { videos: Video[]; settings: VideoSettings; source: "live" | "partial" | "none"; onNotice: (r: ActionResult) => void }) {
  const [state, action] = useFormState(addVideo, null);
  return (
    <div className="space-y-4">
      <form action={action} className="rounded-xl border border-white/[.08] bg-[#111116] p-4 space-y-2">
        <p className="text-xs text-[#9a9aa3]">Synced from <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-[#D77E00]">@TheDigitalOfficial</a> every 10 minutes{source === "none" ? " — feed unreachable right now" : source === "partial" ? " (older uploads couldn't be read this time)" : ""}. Paste a link to add a video from anywhere else:</p>
        <div className="flex flex-wrap gap-2">
          <input name="url" placeholder="https://www.youtube.com/watch?v=…" className={`${input} flex-1 min-w-[220px]`} />
          <Submit pendingText="Fetching…"><Plus className="h-3.5 w-3.5" /> Add video</Submit>
        </div>
        {state && !state.ok && <p role="alert" className="text-xs text-[#ff9a9a]">{state.error}</p>}
        {state?.ok && state.message && <p role="status" className="text-xs text-[#ffd28a]">{state.message}</p>}
      </form>
      <ul className="space-y-2">{videos.map(v => <Row key={v.id} v={v} settings={settings} onNotice={onNotice} />)}</ul>
      {videos.length === 0 && <p className="text-sm text-[#9a9aa3] text-center py-10">No videos found.</p>}
    </div>
  );
}
