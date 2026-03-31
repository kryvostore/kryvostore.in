/**
 * Canonical public site origin (kryvo.store). Used for metadata and absolute URLs.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://kryvo.store).
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://kryvo.store"
  );
}

/**
 * Checkout host derived from Shopify store domain.
 * Keeps checkout aligned with the active Storefront store.
 */
export function getCheckoutOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  const host = raw?.replace(/^https?:\/\//, "").split("/")[0]?.trim();
  return `https://${host || "kryvostore.myshopify.com"}`;
}
