// Renders a 640×400 WebP thumbnail of every site in src/data/sites.ts into
// public/thumbs/<slug>.webp. Run: npm run thumbs   (needs Chrome installed)
//
// Why static thumbnails and not live <iframe>s: any site that sends
// X-Frame-Options / CSP frame-ancestors renders as a grey error tile, a
// protected Vercel deploy renders its login page, and 60+ live frames cost
// ~22 MB per visit. A screenshot is immune to all three.
//
// Options:  ONLY=slug,slug   re-render just those
//           FORCE=1          re-render even if the file exists
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";
import { sites, hostedSites, doProjects, slugOf } from "../src/data/sites.ts";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = resolve("public/thumbs");
const only = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
mkdirSync(OUT, { recursive: true });

const targets = [...sites, ...hostedSites, ...doProjects].map(s => ({ slug: slugOf(s.name), url: s.url, name: s.name }));
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"],
});

let ok = 0, skipped = 0, failed = [];
for (const t of targets) {
  if (only && !only.has(t.slug)) continue;
  const file = `${OUT}/${t.slug}.webp`;
  if (existsSync(file) && !process.env.FORCE) { skipped++; continue; }
  const page = await browser.newPage();
  // 1280×800 layout, captured at half scale → 640×400 file. Half-scale keeps
  // the card crisp at its largest render (~400px wide) without a 1280px image.
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 0.5 });
  try {
    const res = await page.goto(t.url, { waitUntil: "networkidle2", timeout: 45000 });
    const finalHost = new URL(page.url()).host;
    if (!res || res.status() >= 400 || finalHost === "vercel.com") {
      throw new Error(`HTTP ${res?.status()} → ${page.url()}`);
    }
    // Let entrance animations, fonts and hero video posters settle.
    await new Promise(r => setTimeout(r, 3500));
    await page.screenshot({ path: file, type: "webp", quality: 82 });
    ok++;
    console.log(`✓ ${t.slug}`);
  } catch (e) {
    failed.push(`${t.slug}  (${t.url})  ${e.message.split("\n")[0]}`);
    console.log(`✗ ${t.slug}  ${e.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}
await browser.close();
console.log(`\n${ok} rendered · ${skipped} kept · ${failed.length} failed`);
if (failed.length) { console.log("Failed (card falls back to the brand gradient):"); failed.forEach(f => console.log("  " + f)); }
