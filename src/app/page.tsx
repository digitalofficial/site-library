import Gallery from "@/components/Gallery";
import { loadEntries } from "@/lib/store";
import { loadVideos } from "@/lib/videos";

// The list is edited at /admin and lives in Blob, so render per request.
export const dynamic = "force-dynamic";

export default async function Page() {
  const [{ entries }, { videos, settings }] = await Promise.all([loadEntries(), loadVideos()]);
  const visible = videos.filter(v => !settings.hidden.includes(v.id));
  return <Gallery entries={entries} videos={visible} featuredVideo={settings.featured} />;
}
