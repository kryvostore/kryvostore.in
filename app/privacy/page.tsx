import type { Metadata } from "next";
import Privacy from "@/views/Privacy";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/privacy";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "KRYVO privacy policy: how we collect, use, and protect your data when you shop our headless storefront.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "privacy", "data protection", "cookies"],
  alternates: { canonical },
  openGraph: { title: "Privacy Policy — KRYVO", description: desc, url: canonical },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Privacy Policy — KRYVO",
          description: desc,
          path,
        })}
      />
      <Privacy />
    </>
  );
}
