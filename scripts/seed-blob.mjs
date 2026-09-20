// One-time import: pushes src/data/seed.ts + public/thumbs/*.webp into Vercel
// Blob as data/sites-<suffix>.json + thumbs/<id>.webp. After this, /admin owns the list.
//   npm run seed            (refuses if data/sites.json already exists)
//   FORCE=1 npm run seed    (overwrite — you lose every /admin edit)
// Needs BLOB_READ_WRITE_TOKEN in .env.local (vercel env pull).
import { readFileSync, existsSync } from "node:fs";
import { put, list } from "@vercel/blob";
import { seedEntries } from "../src/data/seed.ts";

if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error("BLOB_READ_WRITE_TOKEN missing — run `vercel env pull .env.local`"); process.exit(1); }

const { blobs } = await list({ prefix: "data/sites-", limit: 1 });
if (blobs.length && !process.env.FORCE) { console.error("A sites document already exists in Blob. FORCE=1 to overwrite (this discards /admin edits)."); process.exit(1); }

const entries = [];
for (const e of seedEntries) {
  const file = `public/thumbs/${e.id}.webp`;
  let thumb = null;
  if (existsSync(file)) {
    const b = await put(`thumbs/${e.id}.webp`, readFileSync(file), { access: "public", addRandomSuffix: true, contentType: "image/webp" });
    thumb = b.url;
    console.log(`↑ ${e.id}`);
  } else {
    console.log(`– ${e.id} (no thumbnail; gradient placeholder)`);
  }
  entries.push({ ...e, thumb });
}
await put("data/sites-.json", JSON.stringify(entries), { access: "public", addRandomSuffix: true, contentType: "application/json" });
console.log(`\n✓ data/sites-*.json written with ${entries.length} entries`);
