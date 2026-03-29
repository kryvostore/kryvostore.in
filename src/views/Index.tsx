"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
const heroProduct =
  "/generated/product_headphones_transparent_1774676465954.png";
const watchProduct = "/generated/product_watch_transparent_1774676450623.png";
const avatar1 = "/generated/avatar_1_1774675165218.png";
const avatar2 = "/generated/avatar_2_1774675181855.png";

const Index = () => {
  const { data: featuredProducts } = useFeaturedProducts(8);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const heroPrimary = featuredProducts?.[0]?.node;
  const heroSecondary = featuredProducts?.[1]?.node;

  const scrollTestimonials = (direction: "left" | "right") => {
    const el = testimonialsRef.current;
    if (!el) return;
    const amount = direction === "left" ? -360 : 360;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-12 sm:pb-20 font-sans">
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 mb-12 sm:mb-16 lg:mb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 lg:min-h-[min(100vh-8rem,680px)]">
            {/* Hero Left */}
            <div className="bg-secondary p-6 sm:py-10 lg:p-9 rounded-[2.5rem] flex flex-col justify-between">
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-[3rem] font-extralight leading-[1.1] tracking-tight mb-3 text-foreground">
                  Elevate your lifestyle
                  <br className="hidden sm:block" /> with premium essentials.
                </h1>
                <p className="text-muted-foreground text-sm sm:text-[15px] leading-relaxed mb-6 max-w-[420px]">
                  Elevate your routine with premium goods and curated
                  essentials, combining quality and style to enhance comfort,
                  convenience, and sophistication in every moment of your day.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <Link
                    href="/collections"
                    tabIndex={-1}
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto rounded-full bg-[#111] text-white hover:bg-[#111]/90 shadow-md h-12 sm:h-[54px] px-6 sm:px-8 font-normal text-sm sm:text-[15px]">
                      Browse All Products
                    </Button>
                  </Link>
                  <Link
                    href="/collections"
                    className="group hidden sm:flex"
                    tabIndex={-1}
                  >
                    <Button
                      size="icon"
                      className="h-12 sm:h-[54px] w-12 sm:w-[54px] rounded-full border-none bg-[#111] hover:bg-[#111]/90 text-white shadow-md flex-shrink-0"
                    >
                      <ArrowUpRight className="h-[22px] w-[22px] text-white group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform duration-[160ms] ease-out stroke-[2px]" />
                    </Button>
                  </Link>
                </div>
              </div>

              <Link
                href={
                  heroSecondary
                    ? `/product/${heroSecondary.handle}`
                    : "/collections"
                }
                className="group/feat2 bg-background rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row justify-between items-stretch mt-8 sm:mt-12 lg:mt-16 w-full min-h-0 shadow-sm gap-6 sm:gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 flex flex-col items-start text-left sm:pr-4 lg:pr-6 relative z-10 w-full min-w-0">
                  <span className="inline-block text-[11px] font-medium bg-secondary px-4 py-1.5 rounded-full mb-3 sm:mb-4 lg:mb-6 text-foreground">
                    Featured
                  </span>
                  <h4 className="font-normal text-xl sm:text-2xl mb-2 text-foreground line-clamp-2">
                    {heroSecondary?.title || "eWatsh SF 4"}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 sm:mb-6 max-w-full sm:max-w-[200px] line-clamp-4">
                    {heroSecondary?.description
                      ? `${heroSecondary.description.slice(0, 84)}${heroSecondary.description.length > 84 ? "..." : ""}`
                      : "eWatsh SF 4: Smartwatch with fitness tracking and sleek design."}
                  </p>
                  <div className="font-semibold text-base text-foreground mt-auto">
                    {heroSecondary
                      ? `${heroSecondary.priceRange.minVariantPrice.currencyCode} ${Number.parseFloat(heroSecondary.priceRange.minVariantPrice.amount).toFixed(2)}`
                      : "USD 349.99"}
                  </div>
                </div>
                <div className="relative w-full max-w-[min(100%,280px)] self-start sm:max-w-[min(45%,280px)] sm:w-[45%] shrink-0 aspect-square rounded-3xl overflow-hidden bg-secondary ring-1 ring-border/10 shadow-inner flex items-center justify-center">
                  <img
                    src={
                      heroSecondary?.images?.edges?.[0]?.node?.url ||
                      watchProduct
                    }
                    alt={
                      heroSecondary?.images?.edges?.[0]?.node?.altText ||
                      heroSecondary?.title ||
                      "eWatch SF 4"
                    }
                    className="w-full h-full object-contain group-hover/feat2:scale-105 transition-transform duration-700 drop-shadow-md"
                  />
                </div>
              </Link>
            </div>

            {/* Hero Right — primary featured: circular product well */}
            <Link
              href={
                heroPrimary ? `/product/${heroPrimary.handle}` : "/collections"
              }
              className="bg-secondary rounded-[1.75rem] sm:rounded-[2.5rem] relative flex flex-col group overflow-hidden min-h-[min(72vw,420px)]  max-h-[680px] sm:min-h-[480px] lg:min-h-0 lg:h-full"
            >
              <div className="inline-flex z-10 shrink-0 absolute top-6 left-6 lg:top-9 lg:left-9">
                <span className="text-[11px] font-medium bg-background px-4 py-1.5 rounded-full text-foreground shadow-sm">
                  Featured
                </span>
              </div>

              <img
                src={heroPrimary?.images?.edges?.[0]?.node?.url || heroProduct}
                alt={
                  heroPrimary?.images?.edges?.[0]?.node?.altText ||
                  heroPrimary?.title ||
                  "Headphones x-28m"
                }
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
              />

              {/* Bottom Frosted Overlay */}
              <div className="relative sm:absolute sm:bottom-0 sm:left-0 sm:right-0 p-4 sm:p-6 z-20 mt-auto sm:mt-0 bg-background/60 backdrop-blur-md border border-border/20 rounded-2xl sm:rounded-none sm:border-x-0 sm:border-b-0 sm:rounded-b-[2.5rem] lg:p-9 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 text-left">
                <div className="relative z-10 max-w-full sm:max-w-[min(100%,280px)] min-w-0">
                  <h3 className="font-light text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2 text-foreground line-clamp-2 text-left">
                    {heroPrimary?.title || "Headphones x-28m"}
                  </h3>
                  <p className="text-xs text-foreground/80 leading-relaxed drop-shadow-sm line-clamp-3">
                    {heroPrimary?.description
                      ? `${heroPrimary.description.slice(0, 100)}${heroPrimary.description.length > 100 ? "..." : ""}`
                      : "Headphones X-28M: Superior sound, sleek design, noise cancellation, and all-day comfort."}
                  </p>
                </div>
                <div className="relative z-10 font-semibold tracking-tight text-lg sm:text-xl lg:text-2xl shrink-0 text-foreground self-start sm:self-auto text-left">
                  {heroPrimary
                    ? `${heroPrimary.priceRange.minVariantPrice.currencyCode} ${Number.parseFloat(heroPrimary.priceRange.minVariantPrice.amount).toFixed(2)}`
                    : "USD 149.99"}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {!!featuredProducts?.length && (
        <section className="pb-8 sm:pb-10 lg:pb-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
              <div className="min-w-0">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight">
                  Featured products
                </h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Live catalog picks synced from Shopify collection.
                </p>
              </div>
              <Link
                href="/collections"
                className="text-sm text-foreground underline underline-offset-4 shrink-0 self-start sm:self-auto"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-4">
                What customers are saying
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                Experience the convenience and satisfaction shared by our
                thriving community of shoppers who trust our ecommerce store for
                their every purchase.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="group rounded-full h-12 w-12 border-none shadow-sm bg-background hover:bg-background/80 hover:scale-105 transition-all text-foreground"
                onClick={() => scrollTestimonials("left")}
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
              </Button>
              <Button
                size="icon"
                className="group rounded-full h-12 w-12 bg-foreground hover:bg-foreground/80 hover:scale-105 transition-all text-background shadow-md"
                onClick={() => scrollTestimonials("right")}
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Button>
            </div>
          </div>

          <div
            ref={testimonialsRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide"
          >
            {[
              {
                name: "Alex K.",
                avatar: avatar1,
                title: "Exceptional Headphones and Service!",
                desc: "I couldn't be happier with my purchase from this store. The headphones I bought exceeded my expectations in terms of sound quality and comfort. Plus, the customer service was excellent. Highly recommend!",
              },
              {
                name: "Emily J.",
                avatar: avatar2,
                title: "Online Purchase Worth Every Penny!",
                desc: "I was skeptical about buying headphones online, but I'm so glad I did. These headphones are fantastic! They are comfortable to wear for long periods, and the sound isolation is amazing. Definitely worth every penny.",
              },
              {
                name: "Michael R.",
                avatar: avatar1,
                title: "Great Product, Fast Delivery",
                desc: "The delivery was surprisingly fast, and the packaging was excellent. The displays monitor is very vibrant and perfect for my design work. A great addition to my workspace.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="min-w-[320px] lg:min-w-[450px] max-w-[450px] bg-secondary rounded-[2rem] p-8 lg:p-10 flex flex-col justify-between shrink-0 snap-start"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full overflow-hidden bg-background border border-border">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-6xl text-muted-foreground/30 font-serif leading-none h-12">
                    &ldquo;
                  </div>
                </div>

                <div className="bg-background rounded-3xl p-6 lg:p-8 flex-1 flex flex-col shadow-sm border border-border/50">
                  <h4 className="text-xl lg:text-2xl font-normal mb-4 text-foreground/90">
                    {testimonial.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-8 leading-relaxed flex-1">
                    {testimonial.desc}
                  </p>

                  <div className="mt-auto">
                    <div className="font-normal text-lg mb-2">
                      {testimonial.name}
                    </div>
                    <div className="flex gap-1 text-[#FBBF24]">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
