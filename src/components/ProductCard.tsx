"use client";

import Link from "next/link";
import { ShoppingCart, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);
  const { isFavorite: checkIsFavorite, addItem: addFavorite, removeItem: removeFavorite } = useFavoritesStore();
  
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const variant = node.variants.edges[0]?.node;
  const isFavorite = variant ? checkIsFavorite(variant.id) : false;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    
    if (isFavorite) {
      removeFavorite(variant.id);
      toast.success("Removed from favorites");
    } else {
      addFavorite(product, variant.id);
      toast.success("Added to favorites", { description: node.title });
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: node.title });
  };

  return (
    <Link href={`/product/${node.handle}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-secondary transition-[transform,opacity,box-shadow,filter] duration-200 ease-out">
        <div className="aspect-square overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}
        </div>

        {/* Favorite Button Overlay */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-200 z-20 hover:scale-110 active:scale-95 shadow-sm ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-foreground hover:bg-white"
          }`}
          aria-label="Toggle Favorite"
        >
          <Heart className={`h-[18px] w-[18px] ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !variant?.availableForSale}
            className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full"
            size="sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
          </Button>
        </div>

        {!variant?.availableForSale && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-foreground text-background">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {node.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};
