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
  "Browse all kids learning toys with fast filters for stock, price, and toy type. Shop smart toys in a clean catalog layout.";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "catalog", "learning toys", "kids toy shop"],
  alternates: { canonical },
  openGraph: {
    title: "Shop — All products",
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
          name: "Shop all products",
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
