import { put, list } from "@vercel/blob";

export const CHANNEL_ID = "UCX1SNDow9LcaiEKTpRW4lKg";
export const CHANNEL_URL = "https://www.youtube.com/@TheDigitalOfficial";

export interface Video {
  id: string;
  title: string;
  /** ISO date; missing for videos we only know through oEmbed. */
  published?: string;
  views?: number;
  /** Added by hand in /admin (not from the channel), so it can be removed there. */
  manual?: boolean;
}

/** Owner overrides kept in Blob — the feed is the source of the list, this is what we changed about it. */
export interface VideoSettings {
  featured: string | null;
  hidden: string[];
  titles: Record<string, string>;
  extra: Video[];
}
const EMPTY: VideoSettings = { featured: null, hidden: [], titles: {}, extra: [] };
const PREFIX = "data/videos-";

export const thumbOf = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));

/** The public RSS feed: newest 15 uploads, with view counts. No API key. */
async function fromFeed(): Promise<Video[]> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`feed HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: e.match(/<yt:videoId>([^<]+)/)?.[1] ?? "",
    title: decode(e.match(/<title>([^<]*)/)?.[1] ?? ""),
    published: e.match(/<published>([^<]+)/)?.[1],
    views: Number(e.match(/views="(\d+)"/)?.[1] ?? 0) || undefined,
  })).filter(v => v.id);
}

/** Older uploads: ids embedded in the channel's /videos page (first page only), hydrated through oEmbed. */
async function fromChannelPage(known: Set<string>): Promise<Video[]> {
  const res = await fetch(`${CHANNEL_URL}/videos`, { headers: { "user-agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/128 Safari/537.36", "accept-language": "en-US", cookie: "CONSENT=YES+1" }, next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const html = await res.text();
  const ids = [...new Set([...html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)].map(m => m[1]))].filter(id => !known.has(id));
  const out: Video[] = [];
  for (const id of ids) {
    const v = await oembed(id).catch(() => null);
    if (v) out.push(v);
  }
  return out;
}

export async function oembed(id: string): Promise<Video> {
  const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl(id))}&format=json`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`That video isn't public or doesn't exist (oEmbed HTTP ${res.status}).`);
  const j = (await res.json()) as { title: string };
  return { id, title: j.title };
}

export const videoIdFrom = (input: string): string | null => {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname === "youtu.be") return u.pathname.slice(1, 12) || null;
    if (u.hostname.endsWith("youtube.com")) {
      const v = u.searchParams.get("v"); if (v) return v.slice(0, 11);
      const m = u.pathname.match(/\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})/); if (m) return m[1];
    }
  } catch {}
  return null;
};

async function versions() {
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  return blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
}

export async function loadVideoSettings(): Promise<VideoSettings> {
  try {
    const [newest] = await versions();
    if (!newest) return EMPTY;
    const res = await fetch(newest.url, { cache: "no-store" });
    return { ...EMPTY, ...(await res.json()) };
  } catch (e) {
    console.error("[videos] settings unreadable, using defaults:", e);
    return EMPTY;
  }
}

export async function saveVideoSettings(s: VideoSettings) {
  await put(`${PREFIX}.json`, JSON.stringify(s), { access: "public", addRandomSuffix: true, contentType: "application/json" });
  const old = (await versions()).slice(5);
  if (old.length) await import("@vercel/blob").then(m => m.del(old.map(b => b.url))).catch(() => {});
}

/** Everything the channel + admin know about, with overrides applied. `all` includes hidden ones (for /admin). */
export async function loadVideos(): Promise<{ videos: Video[]; settings: VideoSettings; source: "live" | "partial" | "none" }> {
  const settings = await loadVideoSettings();
  let feed: Video[] = [], source: "live" | "partial" | "none" = "live";
  try { feed = await fromFeed(); } catch (e) { console.error("[videos] feed failed:", e); source = "none"; }
  const known = new Set(feed.map(v => v.id));
  let older: Video[] = [];
  try { older = await fromChannelPage(known); } catch (e) { console.error("[videos] channel page failed:", e); if (source === "live") source = "partial"; }
  const extra = settings.extra.filter(v => !known.has(v.id) && !older.some(o => o.id === v.id));
  const videos = [...feed, ...older, ...extra]
    .map(v => ({ ...v, title: settings.titles[v.id] ?? v.title }))
    .sort((a, b) => (b.published ? +new Date(b.published) : 0) - (a.published ? +new Date(a.published) : 0));
  return { videos, settings, source };
}
