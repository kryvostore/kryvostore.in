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
 * Checkout host (shop.kryvo.store). Used to normalize Shopify checkout URLs from the Cart API.
 */
export function getCheckoutOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_ORIGIN?.replace(/\/$/, "") ??
    "https://shop.kryvo.store"
  );
}
