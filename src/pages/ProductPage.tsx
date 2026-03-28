import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, Loader2, Minus, Plus, Shield, Truck, RotateCcw, ShieldCheck, Headset, Star, ArrowUpRight, CreditCard, Heart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const COLOR_MAP: Record<string, string> = {
  White: "#f8f9fa",
  Black: "#1a1a1a",
  Silver: "#d1d5db",
  Gold: "#d4af37",
  Blue: "#1e3a8a",
  Red: "#dc2626",
  Green: "#166534",
  Brown: "#5c4033",
  Grey: "#4b5563"
};

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const addItem = useCartStore(s => s.addItem);
  const isCartLoading = useCartStore(s => s.isLoading);
  const { isFavorite: checkIsFavorite, addItem: addFavorite, removeItem: removeFavorite } = useFavoritesStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
      return data?.data?.product;
    },
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const images = product.images.edges;
  const variants = product.variants.edges;

  const selectedVariant = variants.find((v: any) =>
    v.node.selectedOptions.every((opt: any) => selectedOptions[opt.name] === opt.value)
  )?.node || variants[0]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: product.title });
  };

  const isFavorite = selectedVariant ? checkIsFavorite(selectedVariant.id) : false;

  const handleToggleFavorite = () => {
    if (!selectedVariant) return;
    if (isFavorite) {
      removeFavorite(selectedVariant.id);
      toast.success("Removed from favorites");
    } else {
      addFavorite({ node: product } as any, selectedVariant.id);
      toast.success("Added to favorites", { description: product.title });
    }
  };

  return (
    <div className="min-h-screen pt-[120px] pb-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        
        {/* TOP SECTION: Gallery & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
          
          {/* 1) Image Gallery Component */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Feature Square */}
            <div className="md:col-span-8 bg-secondary/30 rounded-[2rem] aspect-square flex items-center justify-center overflow-hidden">
              {images[selectedImage]?.node ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-[90%] h-[90%] object-contain mix-blend-multiply drop-shadow-xl transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <ShoppingCart className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>
            
            {/* Stacked Thumbnails */}
            <div className="md:col-span-4 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
              {images.slice(0, 3).map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`bg-secondary/30 rounded-[2rem] aspect-square flex-shrink-0 md:flex-shrink flex items-center justify-center border-[3px] transition-colors duration-[160ms] ease-out min-w-[120px] md:min-w-0 ${
                    selectedImage === i ? "border-foreground/30" : "border-transparent hover:border-foreground/10"
                  }`}
                >
                  <img src={img.node.url} alt="" className="w-[80%] h-[80%] object-contain mix-blend-multiply drop-shadow-sm" />
                </button>
              ))}
            </div>
          </div>

          {/* 2) Product Info Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h1 className="font-display tracking-tight text-4xl lg:text-5xl font-medium mb-3">{product.title}</h1>
            
            <p className="text-[15px] text-muted-foreground/80 font-light leading-relaxed mb-4 max-w-[90%]">
              {product.description || "Premium quality goods curated for modern living. Designed to effortlessly integrate into your daily active lifestyle."}
            </p>

            <div className="flex items-center gap-2 mb-6 text-[#FBBF24]">
              {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              <span className="text-[13px] text-muted-foreground font-medium ml-2">50+ Reviews</span>
            </div>

            <p className="text-2xl font-semibold mb-8">
              {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
            </p>

            {/* Configurator Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {product.options?.filter((o: any) => o.name !== "Title").map((option: any) => (
                <div key={option.name}>
                  <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-3 block">
                    {option.name}
                  </label>
                  
                  <div className="flex flex-wrap gap-3">
                    {option.name.toLowerCase() === 'color' ? (
                      // Color Swatches
                      option.values.map((value: string) => (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          aria-label={value}
                          style={{ backgroundColor: COLOR_MAP[value] || value.toLowerCase() }}
                          className={`w-10 h-10 rounded-full border border-border shadow-sm transition-transform duration-[160ms] ease-out active:scale-90 ${
                            selectedOptions[option.name] === value ? "ring-2 ring-foreground ring-offset-2 scale-110" : "hover:scale-105"
                          }`}
                        />
                      ))
                    ) : (
                      // Standard Chips
                      option.values.map((value: string) => (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-[160ms] ease-out active:scale-95 ${
                            selectedOptions[option.name] === value
                              ? "bg-foreground text-background shadow-md"
                              : "bg-transparent border border-border/80 text-muted-foreground hover:border-foreground/40"
                          }`}
                        >
                          {value}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-3 block">Quantity</label>
                <div className="inline-flex items-center justify-between w-[120px] h-[46px] rounded-full bg-secondary/30 px-1 border border-border/50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-background shadow-sm transition-colors active:scale-95"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-display font-medium text-[15px]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-background shadow-sm transition-colors active:scale-95"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={isCartLoading || !selectedVariant?.availableForSale}
                className="flex-1 h-[60px] text-[16px] rounded-full bg-[#111] text-white shadow-xl hover:shadow-2xl hover:bg-[#1a1a1a]"
              >
                {isCartLoading ? (
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
                className={`w-[60px] h-[60px] shrink-0 rounded-full shadow-sm transition-all duration-200 active:scale-95 ${
                  isFavorite 
                    ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-100" 
                    : "bg-background border-border hover:bg-secondary text-foreground hover:text-foreground/80"
                }`}
                aria-label="Toggle Favorite"
              >
                <Heart className={`h-[22px] w-[22px] ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>
            
            <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed mb-6 px-4">
              Estimated delivery times: 3-6 days (International). Return within 45 days of purchase. Duties & taxes are non-refundable.
            </p>

            {/* Condensed Trust Bar */}
            <div className="flex justify-between items-center bg-secondary/30 rounded-full px-6 py-4 border border-border/40">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-foreground/70" /><span className="text-[12px] font-medium text-foreground/80">Guarantee</span></div>
              <div className="w-[1px] h-4 bg-border/60" />
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-foreground/70" /><span className="text-[12px] font-medium text-foreground/80">Shipping & delivery</span></div>
              <div className="w-[1px] h-4 bg-border/60" />
              <div className="flex items-center gap-2"><Headset className="h-4 w-4 text-foreground/70" /><span className="text-[12px] font-medium text-foreground/80">Support</span></div>
            </div>

          </div>
        </div>

        {/* MID SECTION: Wide Delivery Box */}
        <div className="w-full bg-secondary/30 rounded-[2.5rem] py-12 px-8 lg:px-16 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-background shadow-sm border border-border/40 flex items-center justify-center flex-shrink-0">
              <Truck className="h-6 w-6 text-foreground/80" />
            </div>
            <div className="pt-1">
              <h4 className="font-display text-lg font-medium tracking-tight mb-1">Free shipping</h4>
              <p className="text-xs text-muted-foreground/80">$24+ orders ship free</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-background shadow-sm border border-border/40 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-6 w-6 text-foreground/80" />
            </div>
            <div className="pt-1">
              <h4 className="font-display text-lg font-medium tracking-tight mb-1">Secure Payments</h4>
              <p className="text-xs text-muted-foreground/80">Trusted payment options</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-background shadow-sm border border-border/40 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="h-6 w-6 text-foreground/80" />
            </div>
            <div className="pt-1">
              <h4 className="font-display text-lg font-medium tracking-tight mb-1">45 Days Free Return</h4>
              <p className="text-xs text-muted-foreground/80">Easy, risk-free returns</p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Lifestyle Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Big Vertical Block */}
          <div className="relative rounded-[2.5rem] overflow-hidden min-h-[500px] lg:min-h-[600px] bg-secondary/50 group flex flex-col justify-end p-10 lg:p-14">
            {/* The image (Mocking with a product placeholder scaling to cover for now) */}
            <div className="absolute inset-0 w-full h-full bg-[#1c2226] z-0">
               {/* We use standard product image in a massive absolute frame if no lifestyle image exists in Shopify */}
               <img src={images[0]?.node.url} alt="Lifestyle" className="w-[120%] h-[120%] -mt-[10%] -ml-[10%] object-cover blur-3xl opacity-40 mix-blend-screen" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            
            <div className="relative z-20 w-full flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[320px]">
                <h3 className="font-display text-3xl font-medium text-white mb-3">Power on the Move</h3>
                <p className="text-[14px] text-white/70 font-light leading-relaxed">Stay charged with portable capsule, giving you 4 full charges for your hardware wherever you roam.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 shadow-md h-[54px] px-8 font-medium text-[15px]">
                  Read More
                </Button>
                <Button size="icon" className="h-[54px] w-[54px] rounded-full bg-white text-black hover:bg-white/90 shadow-md flex-shrink-0">
                  <ArrowUpRight className="h-5 w-5 hover:translate-x-[2px] hover:-translate-y-[2px] transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Dual Stacked Horizontals */}
          <div className="flex flex-col gap-6 lg:gap-8 justify-between h-full">

            {/* Horizontal Block 1 */}
            <div className="h-full rounded-[2rem] border border-border/60 bg-background p-6 lg:p-8 flex flex-col sm:flex-row justify-between gap-8 sm:items-center">
              <div className="w-full sm:w-[200px] h-[240px] rounded-[1.5rem] bg-secondary overflow-hidden shrink-0 flex items-center justify-center p-8">
                 <img src={images[0]?.node.url} alt="" className="w-full h-full object-contain mix-blend-multiply drop-shadow-lg scale-110" />
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-2">
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight mb-3">Sound Superiority, Anywhere</h3>
                  <p className="text-[13px] text-muted-foreground/80 leading-relaxed mb-6 border-b border-border/40 pb-6">Experience top-tier audio quality. Whether you're into rock or classical, these buds deliver exceptional sound across all genres.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="rounded-full bg-[#111] text-white hover:bg-[#1a1a1a] shadow-md h-12 px-6 font-medium text-[13px]">
                    Read More
                  </Button>
                  <Button size="icon" className="h-12 w-12 rounded-full border-none bg-[#111] hover:bg-[#1a1a1a] text-white shadow-md flex-shrink-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Horizontal Block 2 */}
            <div className="h-full rounded-[2rem] border border-border/60 bg-background p-6 lg:p-8 flex flex-col sm:flex-row justify-between gap-8 sm:items-center">
              <div className="w-full sm:w-[200px] h-[240px] rounded-[1.5rem] bg-secondary overflow-hidden shrink-0 flex items-center justify-center p-8">
                 <img src={images.length > 1 ? images[1]?.node.url : images[0]?.node.url} alt="" className="w-full h-full object-contain mix-blend-multiply drop-shadow-md" />
              </div>
              <div className="flex-1 flex flex-col justify-between h-full py-2">
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight mb-3">Tailored Comfort</h3>
                  <p className="text-[13px] text-muted-foreground/80 leading-relaxed mb-6 border-b border-border/40 pb-6">With 6 tips in varying sizes, our hardware ensures a perfect fit for every ear, guaranteeing comfort during extended wear.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="rounded-full bg-[#111] text-white hover:bg-[#1a1a1a] shadow-md h-12 px-6 font-medium text-[13px]">
                    Read More
                  </Button>
                  <Button size="icon" className="h-12 w-12 rounded-full border-none bg-[#111] hover:bg-[#1a1a1a] text-white shadow-md flex-shrink-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
