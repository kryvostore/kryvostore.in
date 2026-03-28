import type { Metadata } from "next";
import { Suspense } from "react";
import Collections from "@/views/Collections";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS, getDefaultOpenGraphImages } from "@/lib/seo/config";
import { CollectionsPageSkeleton } from "@/components/skeletons/CollectionsPageSkeleton";

const path = "/collections";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Browse premium electronics, headphones, displays, watches, and phones. Filter by category and shop KRYVO’s curated catalog.";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "catalog", "all products", "electronics shop"],
  alternates: { canonical },
  openGraph: {
    title: "Shop — All products | KRYVO",
    description: desc,
    url: canonical,
    images: getDefaultOpenGraphImages(),
  },
};

export default function CollectionsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Shop all products — KRYVO",
          description: desc,
          path,
        })}
      />
      <Suspense fallback={<CollectionsPageSkeleton />}>
        <Collections />
      </Suspense>
    </>
  );
}
