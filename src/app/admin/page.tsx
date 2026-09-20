import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { loadEntries } from "@/lib/store";
import { loadVideos } from "@/lib/videos";
import AdminPanel from "./AdminPanel";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin | Digital Official Portfolio", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
// Thumbnail capture boots headless Chromium; give the action room.
export const maxDuration = 60;

export default async function AdminPage() {
  if (!isAdmin()) return <LoginForm />;
  const [{ entries, source }, { videos, settings, source: videoSource }] = await Promise.all([loadEntries(), loadVideos()]);
  return <AdminPanel entries={entries} source={source} videos={videos} videoSettings={settings} videoSource={videoSource} />;
}
