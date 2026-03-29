import type { Metadata } from "next";
import RefundPolicy from "@/views/RefundPolicy";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/refund";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Return and refund policy for KRYVO: eligibility, how to return items, refunds, exchanges, and damaged goods.";

export const metadata: Metadata = {
  title: "Return and refund policy",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "returns", "refund policy", "exchanges"],
  alternates: { canonical },
  openGraph: {
    title: "Return and refund policy — KRYVO",
    description: desc,
    url: canonical,
  },
};

export default function RefundPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Return and refund policy — KRYVO",
          description: desc,
          path,
        })}
      />
      <RefundPolicy />
    </>
  );
}
