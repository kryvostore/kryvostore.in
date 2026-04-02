import { useQuery } from "@tanstack/react-query";
import type { ShopifyProduct } from "@/lib/shopify";
import {
  FEATURED_PRODUCTS_BY_COLLECTION_QUERY,
  storefrontApiRequest,
} from "@/lib/shopify";

const DEFAULT_HOME_COLLECTION_HANDLE = "frontpage";

export function useFeaturedProducts(first = 8, collectionHandle?: string) {
  const requestedHandle = (
    collectionHandle?.trim()
    || process.env.NEXT_PUBLIC_SHOPIFY_HOMEPAGE_COLLECTION_HANDLE?.trim()
    || DEFAULT_HOME_COLLECTION_HANDLE
  ).toLowerCase();

  return useQuery({
    queryKey: ["featured-products", requestedHandle, first],
    queryFn: async () => {
      const requestedData = await storefrontApiRequest(
        FEATURED_PRODUCTS_BY_COLLECTION_QUERY,
        {
          handle: requestedHandle,
          first,
        },
      );

      let collection = requestedData?.data?.collection;
      let handleUsed = requestedHandle;

      // Fallback to canonical homepage handle to prevent accidental env mismatch.
      if (!collection && requestedHandle !== DEFAULT_HOME_COLLECTION_HANDLE) {
        const fallbackData = await storefrontApiRequest(
          FEATURED_PRODUCTS_BY_COLLECTION_QUERY,
          {
            handle: DEFAULT_HOME_COLLECTION_HANDLE,
            first,
          },
        );
        collection = fallbackData?.data?.collection;
        handleUsed = DEFAULT_HOME_COLLECTION_HANDLE;
      }

      return {
        requestedHandle,
        handleUsed,
        collectionFound: Boolean(collection),
        collectionTitle: collection?.title as string | undefined,
        collectionHandle: collection?.handle as string | undefined,
        products: (collection?.products?.edges || []) as ShopifyProduct[],
      };
    },
  });
}
