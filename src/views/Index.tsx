"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";

/**
 * Hero background (Unsplash — editorial interior).
 * Drop `public/hero-bg.jpg` (or .webp) and set to `/hero-bg.jpg` to use a local file.
 */
const HERO_BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85";

/** Editorial photography for Why KRYVO bento (Unsplash — swap for /public assets if preferred) */
const WHY_KRYVO_IMAGES = {
  trusted:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
  delivery:
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=80",
  secure:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
} as const;

const Index = () => {
  const { data: featuredCollection } = useFeaturedProducts(12);
  const heroProducts = featuredCollection?.products ?? [];
  const hasCollectionProducts = heroProducts.length > 0;
  const collectionTitle =
    featuredCollection?.collectionTitle?.trim() || "Homepage Collection";

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* Hero — full-bleed background image, copy only (no collection product imagery) */}
      <section className="relative w-full min-h-[800px] md:min-h-screen flex flex-col justify-center overflow-hidden pt-24 sm:pt-28 pb-16 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={HERO_BACKGROUND_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Scrim: left side stronger for text; right side stays lighter so the photo reads clearly */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/60 to-surface/20"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-surface/20 to-transparent sm:hidden"
            aria-hidden
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-2xl xl:max-w-3xl">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] text-on-surface [text-shadow:0_1px_2px_rgba(248,249,250,0.8)]">
              Objects of
              <br />
              <span className="text-on-primary-container">
                Intentional
              </span>{" "}
              design.
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-on-surface-variant leading-relaxed">
              A curated selection for your home and everyday life — chosen for
              clarity, quality, and lasting use.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-start">
              <Link href="/collections">
                <Button className="h-12 px-8 gap-2">Shop the collection</Button>
              </Link>
              <Link href="/collections">
                <Button variant="secondary" className="h-12 px-8">
                  View all products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why KRYVO — image-first bento grid */}
      <section className="w-full bg-surface-container-low py-16 sm:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="mb-10 sm:mb-14 max-w-2xl">
            <span className="text-primary-fixed-dim font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
              Why KRYVO
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
              Built for confident shopping
            </h2>
            <p className="mt-3 text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-xl">
              Three pillars in a bento layout — each tile is built around
              photography, not decoration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-3 sm:gap-4 md:min-h-[520px] lg:min-h-[560px]">
            {/* Tall hero tile */}
            <div className="relative md:col-span-7 md:row-span-2 md:row-start-1 md:col-start-1 min-h-[280px] sm:min-h-[320px] overflow-hidden rounded-2xl bg-surface-container-highest group">
              <Image
                src={WHY_KRYVO_IMAGES.trusted}
                alt="Curated retail shelves with quality products on display"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 58vw"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 max-w-xl px-6 pb-8 pt-16 sm:px-10 sm:pb-10 sm:pt-24">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
                  Trusted store
                </h3>
                <p className="mt-3 text-sm sm:text-[15px] text-white/95 leading-relaxed [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
                  Quality-checked selection — we only list products we&apos;d
                  stand behind.
                </p>
              </div>
            </div>

            {/* Top-right */}
            <div className="relative md:col-span-5 md:row-start-1 md:col-start-8 min-h-[220px] sm:min-h-[240px] overflow-hidden rounded-2xl bg-surface-container-highest group">
              <Image
                src={WHY_KRYVO_IMAGES.delivery}
                alt="Fast, reliable package delivery"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 pt-14 pb-6 px-6 sm:pb-7 sm:px-7">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                  Fast delivery
                </h3>
                <p className="mt-2 text-[13px] sm:text-sm text-white/95 leading-[1.55] max-w-[20rem] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
                  Reliable shipping from dispatch to your door.
                </p>
              </div>
            </div>

            {/* Bottom-right */}
            <div className="relative md:col-span-5 md:row-start-2 md:col-start-8 min-h-[220px] sm:min-h-[240px] overflow-hidden rounded-2xl bg-surface-container-highest group">
              <Image
                src={WHY_KRYVO_IMAGES.secure}
                alt="Secure card payment at checkout"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 pt-14 pb-6 px-6 sm:pb-7 sm:px-7">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                  Secure checkout
                </h3>
                <p className="mt-2 text-[13px] sm:text-sm text-white/95 leading-[1.55] max-w-[20rem] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
                  Encrypted payments you can complete with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasCollectionProducts && (
        <section className="pt-2 pb-10 sm:pb-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-primary-fixed-dim font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
                  Featured
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
                  {collectionTitle}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {heroProducts.slice(0, 8).map((product, index) => (
                <div
                  key={product.node.id}
                  className={index >= 4 ? "hidden md:block" : ""}
                >
                  <div className={index >= 6 ? "hidden lg:block" : ""}>
                    <ProductCard product={product} quickAdd />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/collections">
                <Button className="h-12 px-8">Browse all products</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
