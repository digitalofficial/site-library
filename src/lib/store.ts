import { put, list, del } from "@vercel/blob";
import type { Entry } from "./types";
import { seedEntries } from "@/data/seed";

// Every save is a NEW blob (random suffix) and reads take the newest one via
// the Blob API, because a fixed pathname is served through a CDN with a 60 s
// floor on max-age — an admin save would look like it didn't happen. The
// last few versions are kept as a cheap undo.
const PREFIX = "data/sites-";
const KEEP = 5;

async function versions() {
  const { blobs } = await list({ prefix: PREFIX, limit: 100 });
  return blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
}

/** Newest document, or the seed list if Blob is empty/unreachable — never a blank page. */
export async function loadEntries(): Promise<{ entries: Entry[]; source: "blob" | "seed" }> {
  try {
    const [newest] = await versions();
    if (!newest) return { entries: seedEntries, source: "seed" };
    const res = await fetch(newest.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`sites.json HTTP ${res.status}`);
    const entries = (await res.json()) as Entry[];
    if (!Array.isArray(entries)) throw new Error("sites.json is not an array");
    return { entries, source: "blob" };
  } catch (e) {
    console.error("[store] falling back to seed:", e);
    return { entries: seedEntries, source: "seed" };
  }
}

export async function saveEntries(entries: Entry[]) {
  await put(`${PREFIX}.json`, JSON.stringify(entries), { access: "public", addRandomSuffix: true, contentType: "application/json" });
  const old = (await versions()).slice(KEEP);
  if (old.length) await del(old.map(b => b.url)).catch(e => console.error("[store] prune failed:", e));
}
