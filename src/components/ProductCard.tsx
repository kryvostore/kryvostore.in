"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Loader2, Heart } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
  quickAdd?: boolean;
}

const getProductBadge = (product: ShopifyProduct): "New" | "Hot" | "Sale" | null => {
  const tags = product.node.tags?.map((tag) => tag.toLowerCase()) ?? [];
  if (tags.includes("sale")) return "Sale";
  if (tags.includes("new")) return "New";
  if (tags.includes("hot")) return "Hot";

  if (product.node.createdAt) {
    const createdAt = new Date(product.node.createdAt).getTime();
    if (!Number.isNaN(createdAt)) {
      const fourteenDays = 1000 * 60 * 60 * 24 * 14;
      if (Date.now() - createdAt < fourteenDays) return "New";
    }
  }

  return null;
};

export const ProductCard = ({
  product,
  quickAdd = true,
}: ProductCardProps) => {
  const addItem = useCartStore(s => s.addItem);
  const isLoading = useCartStore(s => s.isLoading);
  const { isFavorite: checkIsFavorite, addItem: addFavorite, removeItem: removeFavorite } = useFavoritesStore();
  
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice;
  const variant = node.variants.edges[0]?.node;
  const isFavorite = variant ? checkIsFavorite(variant.id) : false;
  const badge = getProductBadge(product);

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
    <Link 
      href={`/product/${node.handle}`} 
      className="group block relative"
    >
      <div className="relative overflow-hidden rounded-lg bg-surface-container-lowest transition-colors duration-300">
        {/* Image Container — 4:5 editorial ratio; no drop shadow on photography */}
        <div className="aspect-[4/5] overflow-hidden flex items-center justify-center p-4 sm:p-6">
          {image ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.altText || node.title}
                fill
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-surface-container-low rounded-lg">
              <ShoppingBag className="h-12 w-12 opacity-25" />
            </div>
          )}
        </div>

        {/* Favorite button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 hover:scale-105 active:scale-95 ${
            isFavorite
              ? "bg-primary text-primary-foreground"
              : "bg-surface/90 text-on-surface hover:bg-surface-container-lowest backdrop-blur-md"
          }`}
          aria-label="Toggle Favorite"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {badge === "Sale" && (
            <span className="text-xs font-semibold px-3 py-1 rounded-md bg-surface-container-highest text-on-surface font-label">
              Sale
            </span>
          )}
          {badge !== "Sale" && badge && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-md font-label ${
                badge === "New"
                  ? "bg-primary-fixed-dim/35 text-primary"
                  : "bg-surface-container-highest text-on-surface"
              }`}
            >
              {badge}
            </span>
          )}
          {!variant?.availableForSale && (
            <span className="text-xs font-semibold px-3 py-1 rounded-md bg-on-surface/75 text-primary-foreground backdrop-blur-sm">
              Sold out
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        {quickAdd && variant?.availableForSale && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className="absolute bottom-4 right-4 h-11 w-11 rounded-md btn-editorial-gradient flex items-center justify-center transition-all duration-300 z-20 hover:opacity-90 active:scale-95 group/btn text-primary-foreground shadow-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingBag className="w-5 h-5 group-hover/btn:scale-105 transition-transform" />
            )}
          </button>
        )}
      </div>

      {/* Product Info — Title-MD / Body-MD scale */}
      <div className="mt-4 px-1 pb-2 text-left">
        <h3 className="font-body text-[1.125rem] font-semibold text-on-surface transition-colors line-clamp-2 leading-snug">
          {node.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2.5">
          <p className="font-display text-lg font-bold text-on-surface">
            {price.currencyCode === "USD" ? "$" : price.currencyCode}
            {parseFloat(price.amount).toFixed(2)}
          </p>
          {compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
            <p className="text-sm text-on-surface-variant/80 line-through font-normal font-body">
              {compareAtPrice.currencyCode === "USD" ? "$" : compareAtPrice.currencyCode}
              {parseFloat(compareAtPrice.amount).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

