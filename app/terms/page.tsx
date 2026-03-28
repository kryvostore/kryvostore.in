import type { Metadata } from "next";
import Terms from "@/views/Terms";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/terms";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Terms and conditions for shopping at KRYVO: orders, shipping, liability, and use of kryvo.store.";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "terms of service", "legal"],
  alternates: { canonical },
  openGraph: { title: "Terms & Conditions — KRYVO", description: desc, url: canonical },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Terms & Conditions — KRYVO",
          description: desc,
          path,
        })}
      />
      <Terms />
    </>
  );
}
