"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { CollectionsGridSkeleton } from "@/components/skeletons/CollectionsPageSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CollectionsHeroArt } from "@/components/CollectionsHeroArt";

const CATEGORIES = ["All Product", "Headphones", "Displays", "Watch", "Phones"];

const Collections = () => {
  const searchParams = useSearchParams();
  const { data: products, isLoading } = useProducts(50);
  const [activeCategory, setActiveCategory] = useState("All Product");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filteredProducts = products
    ? products.filter((p) => {
        // Very simple local filtering logic
        const title = p.node.title.toLowerCase();
        if (searchQuery && !title.includes(searchQuery.toLowerCase()))
          return false;

        if (activeCategory === "All Product") return true;
        if (activeCategory === "Headphones" && title.includes("headphone"))
          return true;
        if (activeCategory === "Displays" && title.includes("display"))
          return true;
        if (
          activeCategory === "Watch" &&
          (title.includes("watch") || title.includes("band"))
        )
          return true;
        if (activeCategory === "Phones" && title.includes("phone")) return true;

        // Fallback if the category logic misses something just show it in All
        return false;
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Catalog hero — compact height, neutral commerce gradient (common store pattern) */}
      <div className="w-full relative pt-[120px] pb-14 sm:pb-16 lg:pb-20 overflow-hidden min-h-[min(52vh,440px)] sm:min-h-[min(48vh,400px)] flex items-end bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_20%_30%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_60%,rgba(255,255,255,0.06),transparent_55%)] pointer-events-none"
          aria-hidden
        />
        <CollectionsHeroArt />

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90 pointer-events-none" />

        {/* Hero Content */}
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10 w-full mb-8">
          <div className="max-w-lg">
            <h1 className="text-white text-5xl lg:text-6xl font-display font-medium leading-[1] mb-4 tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
              Shop
            </h1>
            <p className="text-white/90 text-[15px] leading-normal max-w-[390px] font-light drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)]">
              Browse our wide selection of products, thoughtfully crafted to
              meet your needs with quality and convenience in mind.
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping Content Container */}
      <div className="bg-background rounded-t-[2.5rem] lg:rounded-t-[3.5rem] relative -mt-[4rem] z-20 w-full min-h-[60vh] pt-12">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          {/* Filter Pill Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16 px-2">
            <div className="flex items-center gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide scroll-smooth">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 rounded-full px-7 py-3 text-[14px] transition-all duration-150 ease-out active:scale-95 ${
                    activeCategory === cat
                      ? "bg-foreground text-background font-medium shadow-md"
                      : "bg-transparent border border-border/80 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-auto min-w-[320px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full pl-14 h-[54px] border-border/60 bg-transparent text-[15px] shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-foreground focus-visible:border-foreground/50"
              />
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <CollectionsGridSkeleton count={8} />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 pb-32">
              {filteredProducts.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 rounded-[2rem] border border-dashed border-border/60 bg-secondary/20 mb-20">
              <p className="text-foreground text-xl mb-3 font-medium">
                No products match your criteria
              </p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Try adjusting your filters or search query to find what you're
                looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
