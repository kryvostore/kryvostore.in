/**
 * Social / OG image URLs must be absolute (https) for Facebook, X, LinkedIn, WhatsApp previews.
 */
export function ensureAbsoluteImageUrl(
  imageUrl: string,
  siteOrigin: string,
): string {
  const t = imageUrl.trim();
  if (t.startsWith("https://")) return t;
  if (t.startsWith("http://")) return t;
  if (t.startsWith("//")) return `https:${t}`;
  const path = t.startsWith("/") ? t : `/${t}`;
  return new URL(path, siteOrigin).href;
}

type ProductImageNode = {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

const FALLBACK_W = 1200;
const FALLBACK_H = 1200;

export type ResolvedOgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/**
 * Builds Open Graph image entries with real dimensions when Shopify returns them.
 */
/** When the media gallery is empty, Shopify often still has an image on the first variant. */
export function getFirstVariantFeaturedImageUrl(product: {
  variants?: {
    edges?: { node: { image?: { url: string; altText?: string | null } | null } }[];
  };
}): string | null {
  for (const e of product.variants?.edges ?? []) {
    const u = e.node.image?.url?.trim();
    if (u) return u;
  }
  return null;
}

export function resolveProductOgImages(
  edges: { node: ProductImageNode }[] | undefined,
  productTitle: string,
  fallbackOgImageUrl: string,
  siteOrigin: string,
  limit = 4,
  variantImageUrl?: string | null,
): ResolvedOgImage[] {
  const list = (edges ?? []).slice(0, limit).map(({ node }) => {
    const url = ensureAbsoluteImageUrl(node.url, siteOrigin);
    const w =
      node.width && node.width > 0 ? node.width : FALLBACK_W;
    const h =
      node.height && node.height > 0 ? node.height : FALLBACK_H;
    return {
      url,
      width: w,
      height: h,
      alt: node.altText?.trim() || productTitle,
    };
  });

  if (list.length > 0) return list;

  if (variantImageUrl?.trim()) {
    return [
      {
        url: ensureAbsoluteImageUrl(variantImageUrl, siteOrigin),
        width: FALLBACK_W,
        height: FALLBACK_H,
        alt: productTitle,
      },
    ];
  }

  return [
    {
      url: ensureAbsoluteImageUrl(fallbackOgImageUrl, siteOrigin),
      width: 1200,
      height: 630,
      alt: productTitle,
    },
  ];
}

/** Extra <meta> tags some crawlers expect alongside og:image (Next also emits og:image from openGraph.images). */
export function productSocialExtraMeta(primaryImageUrl: string): Record<string, string> {
  const img = primaryImageUrl;
  const secure = img.startsWith("https://") ? img : img;
  const lower = img.split("?")[0]?.toLowerCase() ?? "";
  let mime = "image/jpeg";
  if (lower.endsWith(".png")) mime = "image/png";
  else if (lower.endsWith(".webp")) mime = "image/webp";
  else if (lower.endsWith(".gif")) mime = "image/gif";

  return {
    "og:image:secure_url": secure,
    "og:image:type": mime,
  };
}
