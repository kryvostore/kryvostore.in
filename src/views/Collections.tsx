"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { CollectionsGridSkeleton } from "@/components/skeletons/CollectionsPageSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";

const PRODUCT_TYPES = ["Learning Toys", "Creative Toys", "Educational Games"];
const PAGE_SIZE = 20;
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "az", label: "Alphabetically (A-Z)" },
  { value: "za", label: "Alphabetically (Z-A)" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
] as const;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const getVariant = (product: ShopifyProduct) =>
  product.node.variants.edges[0]?.node;
const getPrice = (product: ShopifyProduct) =>
  Number.parseFloat(product.node.priceRange.minVariantPrice.amount) || 0;

const detectProductType = (product: ShopifyProduct): string => {
  const explicit = product.node.productType?.trim();
  if (explicit) return explicit;
  const title = product.node.title.toLowerCase();
  if (title.includes("game")) return "Educational Games";
  if (title.includes("creative") || title.includes("art"))
    return "Creative Toys";
  return "Learning Toys";
};

const Collections = () => {
  const searchParams = useSearchParams();
  const { data: products, isLoading } = useProducts(120);
  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });
  const [maxInput, setMaxInput] = useState("0");

  useEffect(() => {
    const allProducts = products ?? [];
    if (!allProducts.length) return;
    const prices = allProducts.map(getPrice);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    setPriceBounds({ min, max });
    setPriceRange({ min, max });
    setMaxInput(String(max));
  }, [products]);

  useEffect(() => {
    const q = searchParams.get("q")?.trim().toLowerCase();
    if (!q || !products?.length) return;
    const matchingType = PRODUCT_TYPES.find((type) =>
      q.includes(type.toLowerCase()),
    );
    if (matchingType) setSelectedTypes([matchingType]);
  }, [searchParams, products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [availability, selectedTypes, sortBy, priceRange]);

  const filteredProducts = (products ?? []).filter((p) => {
    const variant = getVariant(p);
    const available = !!variant?.availableForSale;
    const productType = detectProductType(p);
    const price = getPrice(p);

    if (availability === "in" && !available) return false;
    if (availability === "out" && available) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(productType))
      return false;
    if (price < priceRange.min || price > priceRange.max) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "az") return a.node.title.localeCompare(b.node.title);
    if (sortBy === "za") return b.node.title.localeCompare(a.node.title);
    if (sortBy === "priceAsc") return getPrice(a) - getPrice(b);
    if (sortBy === "priceDesc") return getPrice(b) - getPrice(a);
    const aTime = a.node.createdAt ? new Date(a.node.createdAt).getTime() : 0;
    const bTime = b.node.createdAt ? new Date(b.node.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const total = sortedProducts.length;
  const shouldPaginate = total > PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedProducts = shouldPaginate
    ? sortedProducts.slice(startIndex, startIndex + PAGE_SIZE)
    : sortedProducts;
  const from = total === 0 ? 0 : startIndex + 1;
  const to = Math.min(startIndex + PAGE_SIZE, total);

  const updateMaxPrice = (nextValue: number) => {
    const next = Math.min(Math.max(nextValue, priceRange.min), priceBounds.max);
    setPriceRange((prev) => ({ ...prev, max: next }));
    setMaxInput(String(next));
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const clearFilters = () => {
    setAvailability("all");
    setSelectedTypes([]);
    setSortBy("newest");
    setPriceRange(priceBounds);
    setMaxInput(String(priceBounds.max));
  };

  const setCategoryPill = (type: string | null) => {
    setSelectedTypes(type ? [type] : []);
  };

  const isAllCategories = selectedTypes.length === 0;
  const activeSingleType = selectedTypes.length === 1 ? selectedTypes[0] : null;

  return (
    <div className="min-h-screen bg-surface pb-24 lg:pb-14">
      {/* Banner — dark gradient, left-aligned title + breadcrumb */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#001420] via-[#071a26] to-black pt-32 md:pt-36 pb-28 sm:pb-32 lg:pb-36">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_25%,rgba(164,203,232,0.12),transparent_55%),radial-gradient(ellipse_50%_45%_at_85%_70%,rgba(255,255,255,0.04),transparent_50%)]"
          aria-hidden
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <nav
            className="text-sm text-white/55 mb-1 font-body"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white/90 transition-colors">
              Home
            </Link>
            <span className="mx-2 text-white/35" aria-hidden>
              /
            </span>
            <span className="text-white/85">All Products</span>
          </nav>
          <h1 className="font-display capitalize text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.05] max-w-2xl">
            All Products
          </h1>
        </div>
      </div>

      {/* Main panel — rounded top, overlaps banner */}
      <div className="relative z-20 -mt-14 sm:-mt-16 lg:-mt-20 w-full rounded-t-[1.75rem] sm:rounded-t-[2rem] lg:rounded-t-[2.5rem]  bg-surface-container-lowest px-4 sm:px-6 lg:px-8">
        <div className=" max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {/* Category pills + sort / filter toolbar */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8 mb-8">
            {/* Mobile: horizontal scroll; outer clips; lg+: wrap normally */}
            <div className="w-full min-w-0 overflow-hidden lg:overflow-visible">
              <div
                className="flex items-center gap-2 sm:gap-2.5 min-w-0 max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:overflow-y-hidden max-lg:pb-1 max-lg:scrollbar-hide max-lg:[-webkit-overflow-scrolling:touch] lg:flex-wrap lg:overflow-visible"
                role="tablist"
                aria-label="Product categories"
              >
                <button
                  type="button"
                  onClick={() => setCategoryPill(null)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium font-body transition-colors ${
                    isAllCategories
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  All
                </button>
                {PRODUCT_TYPES.map((type) => {
                  const active = activeSingleType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCategoryPill(active ? null : type)}
                      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium font-body transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
              <select
                id="collections-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="h-11 min-w-0 flex-1 lg:min-w-[220px] lg:flex-none rounded-full bg-surface-container-low px-4 text-sm font-semibold text-on-surface border-0 focus:outline-none focus:ring-2 focus:ring-editorial-outline transition-all"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6 text-sm text-on-surface-variant font-body">
            Showing {from}-{to} of {total} products
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
            <aside className="hidden lg:block rounded-xl bg-surface-container-low p-6 h-fit sticky top-24">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary font-display">
                  Filters
                </h2>
                <button
                  type="button"
                  className="text-sm font-medium text-on-primary-container hover:text-primary transition-colors"
                  onClick={clearFilters}
                >
                  Reset
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-medium">Availability</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === "all"}
                        onChange={() => setAvailability("all")}
                      />
                      All
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === "in"}
                        onChange={() => setAvailability("in")}
                      />
                      In Stock
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === "out"}
                        onChange={() => setAvailability("out")}
                      />
                      Out of Stock
                    </label>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium">Price</p>
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange.max}
                    onChange={(e) => updateMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    ₹{priceRange.min} - ₹{priceRange.max}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium">Product Type</p>
                  <div className="space-y-2 text-sm">
                    {PRODUCT_TYPES.map((type) => (
                      <label className="flex items-center gap-2" key={type}>
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleType(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <section>
              {isLoading ? (
                <CollectionsGridSkeleton count={8} />
              ) : paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.node.id}
                        product={product}
                        quickAdd
                      />
                    ))}
                  </div>
                  {shouldPaginate && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-9 min-w-9 rounded-md px-3 text-sm transition-colors font-body ${
                              pageNum === safePage
                                ? "btn-editorial-gradient text-primary-foreground"
                                : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 rounded-xl border md:bg-surface-container-low">
                  <p className="text-on-surface text-lg md:text-xl mb-3 font-display font-semibold">
                    No products <br className="md:hidden" /> match your filters
                  </p>
                  <p className="text-sm text-on-surface-variant font-body">
                    Try changing availability, <br className="md:hidden" />{" "}
                    price range, or product type.
                  </p>
                  <Button onClick={clearFilters} className="mt-5">
                    Clear filters
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[86vw] max-w-sm bg-surface-container-lowest p-5 shadow-ambient overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-medium">Availability</p>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mobile-availability"
                      checked={availability === "all"}
                      onChange={() => setAvailability("all")}
                    />
                    All
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mobile-availability"
                      checked={availability === "in"}
                      onChange={() => setAvailability("in")}
                    />
                    In Stock
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mobile-availability"
                      checked={availability === "out"}
                      onChange={() => setAvailability("out")}
                    />
                    Out of Stock
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">Price</p>
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceRange.max}
                  onChange={(e) => updateMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    ₹{priceBounds.min} -
                  </span>
                  <input
                    value={maxInput}
                    onChange={(e) =>
                      setMaxInput(e.target.value.replace(/[^\d]/g, ""))
                    }
                    onBlur={() => updateMaxPrice(Number(maxInput || "0"))}
                    className="h-10 w-full rounded-lg border border-border px-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">Product Type</p>
                <div className="space-y-2 text-sm">
                  {PRODUCT_TYPES.map((type) => (
                    <label className="flex items-center gap-2" key={type}>
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-0 right-0 w-[80%] z-40 px-4 lg:hidden">
        <Button
          onClick={() => setIsFilterOpen(true)}
          className="w-full h-12 shadow-ambient"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter & Sort
        </Button>
      </div>
    </div>
  );
};

export default Collections;
