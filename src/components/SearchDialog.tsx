"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { useRouter } from "next/navigation";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebouncedQuery("");
    }
  }, [open]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await storefrontApiRequest(PRODUCTS_QUERY, { first: 5, query: debouncedQuery });
      return res?.data?.products?.edges?.map((e: any) => e.node) as ShopifyProduct["node"][];
    },
    enabled: !!debouncedQuery && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden gap-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center px-6 py-5 border-b border-border/40">
          <Search className="w-5 h-5 text-muted-foreground mr-4" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-lg font-medium placeholder:font-light"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto w-full">
          {!debouncedQuery ? (
            <div className="p-10 text-center text-muted-foreground/60 font-light">
              <p>Type to start searching for products...</p>
            </div>
          ) : data?.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground/60 font-light">
              <p>No products found for "{debouncedQuery}"</p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {data?.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => {
                    router.push(`/product/${product.handle}`);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-5 p-4 rounded-3xl hover:bg-secondary/50 cursor-pointer transition-colors duration-200"
                >
                  <div className="w-14 h-14 bg-secondary rounded-2xl overflow-hidden flex-shrink-0">
                    {product.images?.edges[0]?.node?.url && (
                      <img src={product.images.edges[0].node.url} alt={product.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[16px] truncate tracking-tight">{product.title}</h4>
                    <p className="text-[14px] font-light text-muted-foreground mt-0.5">{product.priceRange.minVariantPrice.currencyCode} {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
