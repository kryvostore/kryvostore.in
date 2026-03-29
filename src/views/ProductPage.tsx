"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Button } from "@/components/ui/button";
import { ProductPageSkeleton } from "@/components/skeletons/ProductPageSkeleton";
import {
  ShoppingCart,
  Loader2,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headset,
  Star,
  CreditCard,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { ProductShare } from "@/components/ProductShare";
import { PincodeDeliveryCheck } from "@/components/PincodeDeliveryCheck";
import { useRef } from "react";

type VariantEdge = ShopifyProduct["node"]["variants"]["edges"][number];
type ImageEdge = ShopifyProduct["node"]["images"]["edges"][number];

const COLOR_MAP: Record<string, string> = {
  White: "#f8f9fa",
  Black: "#1a1a1a",
  Silver: "#d1d5db",
  Gold: "#d4af37",
  Blue: "#1e3a8a",
  Red: "#dc2626",
  Green: "#166534",
  Brown: "#5c4033",
  Grey: "#4b5563",
};

const ProductPage = () => {
  const params = useParams<{ slug: string }>();
  const handle = params?.slug;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [isRedirecting, setIsRedirecting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const {
    isFavorite: checkIsFavorite,
    addItem: addFavorite,
    removeItem: removeFavorite,
  } = useFavoritesStore();

  const { data: productsData } = useProducts(20);
  const relatedProducts =
    productsData?.filter((p) => p.node.handle !== handle).slice(0, 4) || [];

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, {
        handle,
      });
      return data?.data?.product;
    },
    enabled: !!handle,
  });

  const images = useMemo(() => product?.images?.edges ?? [], [product]);
  const variants = useMemo(() => product?.variants?.edges ?? [], [product]);

  const selectedVariant =
    variants.find((v: VariantEdge) =>
      v.node.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value,
      ),
    )?.node || variants[0]?.node;

  // Update selected image when variant changes (e.g. on color selection)
  useEffect(() => {
    if (selectedVariant?.image?.url && images.length > 0) {
      const variantImageIndex = images.findIndex(
        (img: ImageEdge) => img.node.url === selectedVariant.image?.url,
      );
      if (variantImageIndex !== -1) {
        setSelectedImage(variantImageIndex);
      }
    }
  }, [selectedVariant, images]);

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setIsRedirecting(true);
    try {
      await addItem({
        product: { node: product } as ShopifyProduct,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price,
        quantity,
        selectedOptions: selectedVariant.selectedOptions || [],
      });

      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("Checkout unavailable at the moment.");
        setIsRedirecting(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsRedirecting(false);
    }
  };

  const isFavorite = selectedVariant
    ? checkIsFavorite(selectedVariant.id)
    : false;

  const handleToggleFavorite = () => {
    if (!selectedVariant) return;
    if (isFavorite) {
      removeFavorite(selectedVariant.id);
      toast.success("Removed from favorites");
    } else {
      addFavorite({ node: product } as ShopifyProduct, selectedVariant.id);
      toast.success("Added to favorites", { description: product.title });
    }
  };

  return (
    <div className="min-h-screen pt-[100px] lg:pt-[120px] pb-24 lg:pb-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* TOP SECTION: Gallery & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-5 mb-16 lg:mb-24 items-start relative">
          {/* 1) Image Gallery Component */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-stretch animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out h-full">
            {/* Main Feature Square */}
            <div className="flex-1 bg-[#f8f9fa] dark:bg-secondary/20 rounded-[2rem] max-h-[500px] aspect-square flex items-center justify-center overflow-hidden">
              {images[selectedImage]?.node ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-[85%] h-[85%] object-contain mix-blend-multiply drop-shadow-xl transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <ShoppingCart className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>

            {/* Thumbnails (Side Scrollable on Desktop, Bottom on Mobile) */}
            {images.length > 1 && (
              <div className="lg:w-[100px] xl:w-[150px] max-h-[500px] shrink-0 relative group/gallery lg:h-full">
                <div
                  ref={scrollContainerRef}
                  className="flex lg:flex-col overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto gap-3 sm:gap-4 snap-x lg:snap-y snap-mandatory pt-1 pb-1 scrollbar-none scroll-smooth lg:absolute lg:inset-0"
                >
                  {images.map((img: ImageEdge, i: number) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-[calc(33.333%-8px)] sm:w-[calc(33.333%-10.66px)] lg:w-full aspect-square bg-[#f8f9fa] dark:bg-secondary/20 rounded-xl md:rounded-[1.25rem] flex items-center justify-center border-2 transition-all duration-[160ms] ease-out overflow-hidden snap-start ${
                        selectedImage === i
                          ? "border-[#a0a0a0] dark:border-border scale-[0.98] shadow-sm"
                          : "border-transparent hover:border-black/10 dark:hover:border-white/10"
                      }`}
                      style={{
                        willChange: "transform",
                        flex: "0 0 calc((100% - 32px) / 3)", // desktop: exactly 1/3 height minus gaps
                      }}
                    >
                      <img
                        src={img.node.url}
                        alt=""
                        className="w-[75%] h-[75%] object-contain mix-blend-multiply drop-shadow-sm transition-transform duration-500 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {images.length > 3 && (
                  <>
                    {/* Desktop Vertical Arrows */}
                    <button
                      type="button"
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollBy({
                            top: -150,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="hidden lg:flex absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border/50 items-center justify-center shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black active:scale-90 z-10"
                    >
                      <ChevronLeft className="h-4 w-4 rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollBy({
                            top: 150,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="hidden lg:flex absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border/50 items-center justify-center shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black active:scale-90 z-10"
                    >
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    </button>

                    {/* Mobile Horizontal Arrows */}
                    <button
                      type="button"
                      onClick={() => scroll("left")}
                      className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black active:scale-90 z-10"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scroll("right")}
                      className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black active:scale-90 z-10"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 2) Product Info Panel */}
          <div className="flex flex-col lg:sticky lg:top-32 lg:pl-8 lg:py-4 h-max animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 ease-out fill-mode-both">
            <h1 className="font-display tracking-tight text-3xl sm:text-4xl max-w-lg font-light mb-4 text-[#1a1a1a] dark:text-foreground">
              {product.title}
            </h1>

            <p className="text-[14px] text-muted-foreground/80 leading-relaxed line-clamp-4 max-w-[95%] mb-4">
              {product.description ||
                "Whether you're on the move or powering through your workout, these headphones are designed to keep up with your active lifestyle effortlessly."}
            </p>

            <div className="flex items-center gap-2 mb-4 text-[#FBBF24]">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-[14px] w-[14px] fill-current" />
              ))}
              <span className="text-[12px] text-muted-foreground font-medium ml-2">
                50+ Reviews
              </span>
            </div>

            <p className="text-2xl font-medium mb-5 tracking-tight">
              {selectedVariant?.price.currencyCode}{" "}
              {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
            </p>

            {/* Configurator Grid */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-6 sm:gap-4 mb-8">
              {/* Product Options */}
              <div className="flex flex-col gap-5 w-full">
                {product.options
                  ?.filter((o) => o.name !== "Title")
                  .map((option) => (
                    <div key={option.name}>
                      <label
                        htmlFor={option.name}
                        className="text-[13px] text-muted-foreground mb-3 block"
                      >
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {option.name.toLowerCase() === "color"
                          ? option.values.map((value: string) => (
                              <button
                                type="button"
                                key={value}
                                onClick={() =>
                                  setSelectedOptions((prev) => ({
                                    ...prev,
                                    [option.name]: value,
                                  }))
                                }
                                aria-label={value}
                                style={{
                                  backgroundColor:
                                    COLOR_MAP[value] || value.toLowerCase(),
                                }}
                                className={`w-8 h-8 rounded-full border border-border/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-[160ms] ease-out active:scale-[0.97] ${
                                  selectedOptions[option.name] === value
                                    ? "ring-[1.5px] ring-foreground ring-offset-[3px] scale-[1.05]"
                                    : "hover:scale-[1.02]"
                                }`}
                              />
                            ))
                          : option.values.map((value: string) => (
                              <button
                                type="button"
                                key={value}
                                onClick={() =>
                                  setSelectedOptions((prev) => ({
                                    ...prev,
                                    [option.name]: value,
                                  }))
                                }
                                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-[background-color,color,border-color,transform] duration-[160ms] ease-out active:scale-[0.97] ${
                                  selectedOptions[option.name] === value
                                    ? "bg-foreground text-background"
                                    : "bg-transparent border border-border/80 text-muted-foreground hover:border-foreground/40"
                                }`}
                              >
                                {value}
                              </button>
                            ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Quantity Slider */}
              <div className="sm:ml-auto shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <label
                  htmlFor="quantity"
                  className="text-[13px] text-muted-foreground mb-3 block sm:text-right"
                >
                  Quantity
                </label>
                <div className="inline-flex items-center justify-between w-full sm:w-[110px] h-10 rounded-md px-1 bg-[#fcfcfc] dark:bg-secondary/40 border border-border/40">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-display font-medium text-[14px]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.97]"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <PincodeDeliveryCheck
              variantAvailable={Boolean(selectedVariant?.availableForSale)}
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full mb-6 relative">
              <Button
                onClick={handleBuyNow}
                disabled={
                  isCartLoading ||
                  isRedirecting ||
                  !selectedVariant?.availableForSale
                }
                className="flex-1 h-14 md:h-[60px] text-[15px] font-medium rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
              >
                {isCartLoading || isRedirecting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : !selectedVariant?.availableForSale ? (
                  "Sold Out"
                ) : (
                  "Buy Now"
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={`w-14 h-14 md:w-[60px] md:h-[60px] shrink-0 rounded-full bg-transparent border border-border shadow-sm active:scale-[0.97] transition-[transform,background-color,color,border-color] duration-[160ms] ease-out will-change-transform ${
                  isFavorite
                    ? "text-red-500 hover:text-red-600 bg-red-50/50 dark:bg-red-950/20"
                    : "text-foreground hover:bg-secondary/50"
                }`}
              >
                <Heart
                  className={`h-[20px] w-[20px] ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            <p className="mb-6 max-w-[95%] text-left text-[11px] leading-relaxed text-muted-foreground">
              <span className="text-foreground/90">Shipping &amp; returns:</span>{" "}
              ~5–10 business days (India). 45-day returns.
            </p>

            {handle ? (
              <ProductShare title={product.title} slug={handle} />
            ) : null}

            {/* Light Bar with guarantees */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center bg-[#f8f9fa] dark:bg-secondary/20 rounded-[1rem] px-6 py-4 gap-4 sm:gap-2 border border-border/30 shadow-sm">
              <div className="flex items-center gap-2 bg-white dark:bg-secondary/50 px-3 py-1.5 rounded-lg shadow-sm border border-border/20">
                <ShieldCheck className="h-[14px] w-[14px] text-foreground" />
                <span className="text-[12px] font-medium text-foreground">
                  Guarantee
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5">
                <Truck className="h-[14px] w-[14px] text-foreground/70" />
                <span className="text-[12px] font-medium text-foreground/80">
                  Shipping & delivery
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5">
                <Headset className="h-[14px] w-[14px] text-foreground/70" />
                <span className="text-[12px] font-medium text-foreground/80">
                  Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MID SECTION: Wide Delivery Box */}
        <div className="w-full bg-[#f8f9fa] dark:bg-secondary/20 border border-border/30 rounded-[2rem] py-8 px-6 lg:py-10 lg:px-12 mb-16 lg:mb-24 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-secondary/50 shadow-sm border border-border/20 flex items-center justify-center flex-shrink-0">
              <Truck className="h-5 w-5 text-foreground/90" />
            </div>
            <div className="pt-0.5">
              <h4 className="font-display text-[15px] font-medium tracking-tight mb-0.5">
                Free shipping
              </h4>
              <p className="text-[12px] text-muted-foreground/80">
                On all orders — no extra charge at checkout
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-secondary/50 shadow-sm border border-border/20 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-5 w-5 text-foreground/90" />
            </div>
            <div className="pt-0.5">
              <h4 className="font-display text-[15px] font-medium tracking-tight mb-0.5">
                Secure Payments
              </h4>
              <p className="text-[12px] text-muted-foreground/80">
                Trusted payment options
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-secondary/50 shadow-sm border border-border/20 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="h-5 w-5 text-foreground/90" />
            </div>
            <div className="pt-0.5">
              <h4 className="font-display text-[15px] font-medium tracking-tight mb-0.5">
                45 Days Free Return
              </h4>
              <p className="text-[12px] text-muted-foreground/80">
                Easy, risk-free returns
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Related Products */}
        <div className="mt-8 mb-16 lg:mb-0 pt-12 lg:pt-16 border-t border-border/40">
          <h2 className="font-display tracking-tight text-3xl lg:text-4xl font-medium mb-8 lg:mb-12">
            Related Products
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-[2rem] border border-dashed border-border/60 bg-secondary/20">
              <p className="text-foreground text-xl mb-2 font-medium">
                No related products found
              </p>
              <p className="text-sm text-muted-foreground">
                Check back later for more recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
