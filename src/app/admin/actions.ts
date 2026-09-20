"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, clearAdminCookie, isAdmin, setAdminCookie } from "@/lib/auth";
import { captureThumb } from "@/lib/capture";
import { loadEntries, saveEntries } from "@/lib/store";
import { del } from "@vercel/blob";
import { slugOf, TABS, KINDS, type Entry, type Tab, type Kind } from "@/lib/types";
import { loadVideoSettings, saveVideoSettings, oembed, videoIdFrom, type VideoSettings } from "@/lib/videos";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

const HEX = /^#[0-9a-f]{6}$/i;

export async function login(_: unknown, form: FormData): Promise<ActionResult> {
  const pw = String(form.get("password") ?? "");
  if (!checkPassword(pw)) return { ok: false, error: "Wrong password." };
  setAdminCookie();
  redirect("/admin");
}

export async function logout() {
  clearAdminCookie();
  redirect("/admin");
}

function guard() {
  if (!isAdmin()) throw new Error("Not signed in.");
}

/** Every mutation: read the list, change it, write it back, wake the gallery. */
async function mutate(fn: (entries: Entry[]) => Entry[] | Promise<Entry[]>): Promise<ActionResult> {
  guard();
  try {
    const { entries, source } = await loadEntries();
    if (source === "seed") return { ok: false, error: "Blob store is empty or unreachable — run `npm run seed` first so edits don't overwrite the seed." };
    const next = await fn(entries);
    await saveEntries(next);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** App Store lookup → 512px icon. Best effort: a miss just means no icon on the card. */
async function appIconFor(appStore: string | undefined): Promise<string | undefined> {
  const id = appStore?.match(/\/id(\d+)/)?.[1];
  if (!id) return undefined;
  try {
    const r = await fetch(`https://itunes.apple.com/lookup?id=${id}`, { next: { revalidate: 86400 } });
    const j = (await r.json()) as { results?: { artworkUrl512?: string }[] };
    return j.results?.[0]?.artworkUrl512;
  } catch { return undefined; }
}

const optionalUrl = (v: string, label: string) => { if (!v) return undefined; if (!/^https?:\/\/\S+$/.test(v)) throw new Error(`${label} must be a full https:// link.`); return v; };

/** Pull the editable fields off a form, validating the few that can break the page. */
async function fieldsFrom(form: FormData, tab: Tab): Promise<Omit<Entry, "id" | "tab" | "thumb">> {
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const name = str("name"), url = str("url"), industry = str("industry");
  if (!name) throw new Error("Name is required.");
  if (!/^https?:\/\/\S+$/.test(url)) throw new Error("URL must start with http:// or https://");
  const c0 = str("color0") || "#D77E00", c1 = str("color1") || "#111116";
  if (!HEX.test(c0) || !HEX.test(c1)) throw new Error("Colours must be 6-digit hex like #D77E00.");
  const kind = (KINDS as string[]).includes(str("kind")) ? (str("kind") as Kind) : "multi";
  const appStore = optionalUrl(str("appStore"), "App Store URL"), playStore = optionalUrl(str("playStore"), "Google Play URL");
  const base = { name, industry, url, colors: [c0, c1] as [string, string], kind, pages: (kind === "single" ? "single" : "multi") as Entry["pages"], appStore, playStore, appIcon: await appIconFor(appStore), highlight: str("highlight") || undefined };
  if (tab === "library") {
    return {
      ...base,
      style: (str("style") || "V6") as Entry["style"],
      font: str("font") || "Inter",
      description: str("description"),
      features: str("features").split(",").map(s => s.trim()).filter(Boolean),
    };
  }
  return { ...base, platform: (str("platform") || "Next.js") as Entry["platform"] };
}

export async function addEntry(_: unknown, form: FormData): Promise<ActionResult> {
  const tab = String(form.get("tab")) as Tab;
  if (!TABS.includes(tab)) return { ok: false, error: "Pick a tab." };
  let captureError: string | null = null;
  const res = await mutate(async entries => {
    const fields = await fieldsFrom(form, tab);
    let id = slugOf(fields.name) || "site";
    while (entries.some(e => e.id === id)) id += "-2";
    let thumb: string | null = null;
    try { thumb = await captureThumb(id, fields.url); } catch (e) { captureError = e instanceof Error ? e.message : String(e); }
    return [...entries, { id, tab, thumb, ...fields }];
  });
  if (res.ok && captureError) return { ok: true, message: `Saved, but the thumbnail failed: ${captureError}. Use "Recapture" once the site is reachable.` };
  return res.ok ? { ok: true, message: "Added — it's live on the site now." } : res;
}

export async function updateEntry(_: unknown, form: FormData): Promise<ActionResult> {
  const id = String(form.get("id"));
  return mutate(async entries => {
    const i = entries.findIndex(e => e.id === id);
    if (i < 0) throw new Error("Entry not found.");
    const fields = await fieldsFrom(form, entries[i].tab);
    return entries.map((e, j) => j === i ? { ...e, ...fields } : e);
  });
}

export async function moveEntry(id: string, tab: Tab): Promise<ActionResult> {
  if (!TABS.includes(tab)) return { ok: false, error: "Unknown tab." };
  return mutate(entries => {
    const e = entries.find(x => x.id === id);
    if (!e) throw new Error("Entry not found.");
    // Moving between tabs changes which fields matter; fill the defaults the new tab needs.
    const moved: Entry = tab === "library"
      ? { ...e, tab, style: e.style ?? "V5", font: e.font ?? "Inter", description: e.description ?? "", pages: e.pages ?? "single", features: e.features ?? [] }
      : { ...e, tab, platform: e.platform ?? "Next.js" };
    return [...entries.filter(x => x.id !== id), moved]; // lands at the end of its new tab
  });
}

/** Old thumbnails are orphans once nothing points at them; failing to delete one is harmless. */
const dropThumb = (url: string | null | undefined) => url ? del(url).catch(e => console.error("[thumb] delete failed:", e)) : Promise.resolve();

export async function deleteEntry(id: string): Promise<ActionResult> {
  let old: string | null = null;
  const res = await mutate(entries => { old = entries.find(e => e.id === id)?.thumb ?? null; return entries.filter(e => e.id !== id); });
  if (res.ok) await dropThumb(old);
  return res;
}

/** Swap with the neighbour in the same tab. Order within a tab = order in the array. */
export async function nudgeEntry(id: string, dir: -1 | 1): Promise<ActionResult> {
  return mutate(entries => {
    const i = entries.findIndex(e => e.id === id);
    if (i < 0) throw new Error("Entry not found.");
    const tab = entries[i].tab;
    let j = i + dir;
    while (j >= 0 && j < entries.length && entries[j].tab !== tab) j += dir;
    if (j < 0 || j >= entries.length) return entries;
    const next = [...entries];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
}

export async function recaptureEntry(id: string): Promise<ActionResult> {
  return mutate(async entries => {
    const e = entries.find(x => x.id === id);
    if (!e) throw new Error("Entry not found.");
    const thumb = await captureThumb(id, e.url); // throws → nothing saved, old thumb kept
    await dropThumb(e.thumb);
    return entries.map(x => x.id === id ? { ...x, thumb } : x);
  });
}

// ───────────── Videos ─────────────

async function mutateVideos(fn: (s: VideoSettings) => VideoSettings | Promise<VideoSettings>): Promise<ActionResult> {
  guard();
  try {
    const next = await fn(await loadVideoSettings());
    await saveVideoSettings(next);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function featureVideo(id: string | null) {
  return mutateVideos(s => ({ ...s, featured: id }));
}

export async function toggleHiddenVideo(id: string) {
  return mutateVideos(s => ({ ...s, hidden: s.hidden.includes(id) ? s.hidden.filter(h => h !== id) : [...s.hidden, id] }));
}

export async function renameVideo(_: unknown, form: FormData): Promise<ActionResult> {
  const id = String(form.get("id")), title = String(form.get("title") ?? "").trim();
  return mutateVideos(s => {
    const titles = { ...s.titles };
    if (title) titles[id] = title; else delete titles[id]; // empty = back to YouTube's title
    return { ...s, titles };
  });
}

export async function addVideo(_: unknown, form: FormData): Promise<ActionResult> {
  const id = videoIdFrom(String(form.get("url") ?? ""));
  if (!id) return { ok: false, error: "Paste a YouTube link (watch, youtu.be or shorts) or an 11-character video id." };
  const res = await mutateVideos(async s => {
    if (s.extra.some(v => v.id === id)) throw new Error("That video is already in the list.");
    const v = await oembed(id);
    return { ...s, extra: [...s.extra, { ...v, manual: true }] };
  });
  return res.ok ? { ok: true, message: "Added. If it's on our channel already it just shows once." } : res;
}

export async function removeVideo(id: string) {
  return mutateVideos(s => ({ ...s, extra: s.extra.filter(v => v.id !== id), hidden: s.hidden.filter(h => h !== id), featured: s.featured === id ? null : s.featured }));
}
