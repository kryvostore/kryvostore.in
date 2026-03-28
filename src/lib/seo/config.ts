import { getSiteUrl } from "@/lib/site";

export const SITE_NAME = "KRYVO STORE";
export const SITE_NAME_SHORT = "KRYVO";

/** Default meta description (≈155–160 chars for SERP snippets). */
export const DEFAULT_DESCRIPTION =
  "Premium tech accessories and lifestyle products. Shop curated headphones, displays, wearables, and more at KRYVO — quality shipping across India.";

/** Broad + long-tail keywords for discovery and answer engines (avoid stuffing in body). */
export const DEFAULT_KEYWORDS = [
  "KRYVO",
  "KRYVO STORE",
  "premium tech accessories",
  "headphones online",
  "smartwatch",
  "electronics India",
  "lifestyle tech",
  "curated gadgets",
] as const;

export function getDefaultOgImage(): string {
  const custom = process.env.NEXT_PUBLIC_OG_IMAGE_URL?.trim();
  if (custom) return custom.startsWith("http") ? custom : `${getSiteUrl()}${custom}`;
  return `${getSiteUrl()}/logo.png`;
}

export function getTwitterHandle(): string | undefined {
  const h = process.env.NEXT_PUBLIC_TWITTER_HANDLE?.trim();
  if (!h) return undefined;
  return h.startsWith("@") ? h : `@${h}`;
}

export function getSiteLogoUrl(): string {
  return `${getSiteUrl()}/logo.png`;
}
