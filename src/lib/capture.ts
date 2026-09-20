import { put } from "@vercel/blob";
import { existsSync } from "node:fs";

const LOCAL_CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/**
 * Screenshot a site at 1280×800, captured at half scale → 640×400 WebP, and
 * upload it to Blob. Returns the public URL. Uses the machine's Chrome in dev
 * and @sparticuz/chromium on Vercel. Throws on any failure so the caller can
 * keep the old thumbnail instead of overwriting it with nothing.
 */
export async function captureThumb(id: string, url: string): Promise<string> {
  const puppeteer = (await import("puppeteer-core")).default;
  let executablePath: string;
  let args: string[];
  if (!process.env.VERCEL && existsSync(LOCAL_CHROME)) {
    executablePath = LOCAL_CHROME;
    args = ["--hide-scrollbars", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"];
  } else {
    const chromium = (await import("@sparticuz/chromium")).default;
    executablePath = await chromium.executablePath();
    args = [...chromium.args, "--hide-scrollbars"];
  }

  const browser = await puppeteer.launch({ executablePath, args, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 0.5 });
    const res = await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const finalHost = new URL(page.url()).host;
    if (!res || res.status() >= 400) throw new Error(`Site returned HTTP ${res?.status() ?? "no response"}`);
    if (finalHost === "vercel.com") throw new Error("Site is behind Vercel Deployment Protection (redirects to a login page)");
    await new Promise(r => setTimeout(r, 2500)); // entrance animations / fonts
    const buf = await page.screenshot({ type: "webp", quality: 82 });
    const blob = await put(`thumbs/${id}.webp`, Buffer.from(buf), {
      access: "public",
      addRandomSuffix: true, // new URL per capture → no stale CDN copies
      contentType: "image/webp",
    });
    return blob.url;
  } finally {
    await browser.close();
  }
}
