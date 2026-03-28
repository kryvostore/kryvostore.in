import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';

export function useProducts(first = 20, searchQuery?: string) {
  return useQuery({
    queryKey: ['products', first, searchQuery],
    queryFn: async () => {
      const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query: searchQuery || null });
      return (data?.data?.products?.edges || []) as ShopifyProduct[];
    },
  });
}
