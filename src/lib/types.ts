export type Tab = "library" | "current" | "do";
export type Style = "V1" | "V2" | "V3" | "V4" | "V5" | "V6"; // V6 = 2026 house stack (Vite/Next + GSAP + Three)
export type PageType = "single" | "multi";
export type Platform = "Vite" | "Next.js" | "WordPress";
/** What kind of build it is — every tab is sectioned by this. */
export type Kind = "ecommerce" | "suite" | "single" | "multi";
export const KINDS: Kind[] = ["ecommerce", "suite", "single", "multi"];
export const KIND_LABEL: Record<Kind, string> = { ecommerce: "Ecommerce", suite: "Business Suite", single: "Single page", multi: "Multi-page" };
export const KIND_HINT: Record<Kind, string> = { ecommerce: "Cart, checkout, orders", suite: "Users, dashboards, portals", single: "One-page site", multi: "Multi-page site" };

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
  /** Optional only for documents written before 2026-09-20; see kindOf(). */
  kind?: Kind;
  // Spotlight: a native app or a one-line brag. Cards with any of these get the highlighted treatment.
  appStore?: string;
  playStore?: string;
  /** App icon URL (pulled from the App Store lookup when appStore is set). */
  appIcon?: string;
  highlight?: string;
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

/** Older documents have no `kind`; fall back to the Library page type. */
export const kindOf = (e: Entry): Kind => e.kind ?? (e.pages === "single" ? "single" : "multi");

export const isSpotlight = (e: Entry) => !!(e.appStore || e.playStore || e.highlight);
