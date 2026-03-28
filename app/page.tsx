import type { Metadata } from "next";
import Index from "@/views/Index";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
} from "@/lib/seo/config";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";

const canonical = getSiteUrl();

export const metadata: Metadata = {
  title: "Home",
  description:
    "Shop premium tech accessories and lifestyle products at KRYVO. Curated headphones, displays, wearables, and essentials — shipped with care.",
  keywords: [...DEFAULT_KEYWORDS, "official store", "shop online"],
  alternates: { canonical },
  openGraph: {
    title: `${SITE_NAME} — Home`,
    description:
      "Premium tech accessories and lifestyle products. Curated essentials for modern living.",
    url: canonical,
  },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: `${SITE_NAME} — Home`,
          description: DEFAULT_DESCRIPTION,
          path: "/",
        })}
      />
      <Index />
    </>
  );
}
