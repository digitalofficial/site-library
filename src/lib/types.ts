export type Tab = "library" | "current" | "do";
export type Style = "V1" | "V2" | "V3" | "V4" | "V5";
export type PageType = "single" | "multi";
export type Platform = "Vite" | "Next.js" | "WordPress";

/** One card in the portfolio. Which fields matter depends on the tab. */
export interface Entry {
  id: string;
  tab: Tab;
  name: string;
  industry: string;
  url: string;
  colors: [string, string];
  /** Public Blob URL of the 640×400 WebP screenshot; null → brand-gradient placeholder. */
  thumb: string | null;
  // Library (template) fields
  style?: Style;
  font?: string;
  description?: string;
  pages?: PageType;
  features?: string[];
  // Current / DO Projects fields
  platform?: Platform;
}

export const TAB_LABEL: Record<Tab, string> = { library: "Library", current: "Current", do: "DO Projects" };
export const TABS: Tab[] = ["library", "current", "do"];

export const slugOf = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
