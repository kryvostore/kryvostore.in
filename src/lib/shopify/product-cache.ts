import { cache } from "react";
import { fetchProductByHandle } from "@/lib/shopify";

/** Dedupes Storefront product fetches within the same request (metadata + JSON-LD + page). */
export const getCachedProductByHandle = cache((handle: string) =>
  fetchProductByHandle(handle),
);
