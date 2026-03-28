import type { Metadata } from "next";
import TrackOrder from "@/views/TrackOrder";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/track-order";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Track your KRYVO order: enter your order number to see fulfillment status and delivery progress.";

export const metadata: Metadata = {
  title: "Track Order",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "order status", "tracking", "delivery"],
  alternates: { canonical },
  openGraph: { title: "Track your order — KRYVO", description: desc, url: canonical },
};

export default function TrackOrderPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Track order — KRYVO",
          description: desc,
          path,
        })}
      />
      <TrackOrder />
    </>
  );
}
