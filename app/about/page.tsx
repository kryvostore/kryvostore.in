import type { Metadata } from "next";
import About from "@/views/About";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/about";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Learn about KRYVO — our mission, values, and curated premium tech and lifestyle products for modern living.";

export const metadata: Metadata = {
  title: "About Us",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "our story", "brand", "mission"],
  alternates: { canonical },
  openGraph: {
    title: "About KRYVO",
    description: desc,
    url: canonical,
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "About KRYVO",
          description: desc,
          path,
        })}
      />
      <About />
    </>
  );
}
