import type { Metadata } from "next";
import Index from "@/views/Index";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  SITE_NAME,
  getDefaultOgImage,
  getDefaultOpenGraphImages,
} from "@/lib/seo/config";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";

const canonical = getSiteUrl();

export const metadata: Metadata = {
  title: "Home",
  description:
    "Smart toys for smart kids. Explore educational toys, creative play kits, and learning games designed for modern families.",
  keywords: [...DEFAULT_KEYWORDS, "official store", "shop online"],
  alternates: { canonical },
  openGraph: {
    title: `${SITE_NAME} — Home`,
    description:
      "Discover educational toys, creative toys, and games for kids.",
    url: canonical,
    images: getDefaultOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Home`,
    description:
      "Discover educational toys, creative toys, and games for kids.",
    images: [getDefaultOgImage()],
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
