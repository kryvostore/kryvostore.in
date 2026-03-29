import type { CartItem } from "@/lib/shopify";

/** Shown under order totals when items may ship from multiple sources. */
export const SEPARATE_PACKAGES_NOTE =
  "Items may arrive in separate packages.";

/** Headless storefront: shipping is always free; total equals subtotal. */
export function computeCartOrderSummary(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currencyCode = items[0]?.price.currencyCode ?? "USD";
  const shippingCost = 0;
  return {
    currencyCode,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
  };
}
