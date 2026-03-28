import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/refund";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Returns and refunds for KRYVO orders: eligibility, timelines, and how we process refunds through Shopify.";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "returns", "refund policy"],
  alternates: { canonical },
  openGraph: { title: "Returns & refunds — KRYVO", description: desc, url: canonical },
};

export default function RefundPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Returns & refunds — KRYVO",
          description: desc,
          path,
        })}
      />
      <div className="min-h-screen bg-background pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-light mb-6">
            Returns & refunds
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            For return eligibility, time windows, and refund processing, please
            refer to your order confirmation email or contact our support team.
            Headless storefront orders are fulfilled through Shopify; refund
            rules follow our store policy configured in Shopify admin.
          </p>
          <Link
            href="/contact"
            className="text-foreground underline underline-offset-4"
          >
            Contact support
          </Link>
        </div>
      </div>
    </>
  );
}
