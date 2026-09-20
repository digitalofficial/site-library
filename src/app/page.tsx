import Gallery from "@/components/Gallery";
import { loadEntries } from "@/lib/store";

// The list is edited at /admin and lives in Blob, so render per request.
export const dynamic = "force-dynamic";

export default async function Page() {
  const { entries } = await loadEntries();
  return <Gallery entries={entries} />;
}
