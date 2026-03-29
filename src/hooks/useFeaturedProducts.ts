import { useQuery } from "@tanstack/react-query";
import {
  FEATURED_PRODUCTS_BY_COLLECTION_QUERY,
  ShopifyProduct,
  storefrontApiRequest,
} from "@/lib/shopify";

const DEFAULT_HOME_COLLECTION_HANDLE = "homepage-featured";

export function useFeaturedProducts(first = 8) {
  const handle =
    process.env.NEXT_PUBLIC_SHOPIFY_HOMEPAGE_COLLECTION_HANDLE?.trim() ||
    DEFAULT_HOME_COLLECTION_HANDLE;

  return useQuery({
    queryKey: ["featured-products", handle, first],
    queryFn: async () => {
      const data = await storefrontApiRequest(
        FEATURED_PRODUCTS_BY_COLLECTION_QUERY,
        {
          handle,
          first,
        },
      );
      return (data?.data?.collection?.products?.edges || []) as ShopifyProduct[];
    },
  });
}
