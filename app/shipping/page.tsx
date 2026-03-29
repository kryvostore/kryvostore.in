import type { Metadata } from "next";
import ShippingPolicy from "@/views/ShippingPolicy";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/shipping";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "KRYVO shipping policy: free standard shipping within India, delivery estimates, and multiple packages.";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "shipping policy", "delivery", "free shipping"],
  alternates: { canonical },
  openGraph: { title: "Shipping Policy — KRYVO", description: desc, url: canonical },
};

export default function ShippingPolicyPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Shipping Policy — KRYVO",
          description: desc,
          path,
        })}
      />
      <ShippingPolicy />
    </>
  );
}
