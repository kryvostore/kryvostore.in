import type { Metadata } from "next";
import Contact from "@/views/Contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactFaqs } from "@/data/contact-faqs";
import { faqPageSchema, webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/contact";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Contact KRYVO for orders, returns, and product questions. FAQ, email, and WhatsApp support.";

export const metadata: Metadata = {
  title: "Contact & FAQ",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "customer support", "shipping FAQ", "returns"],
  alternates: { canonical },
  openGraph: {
    title: "Contact KRYVO — Support & FAQ",
    description: desc,
    url: canonical,
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            name: "Contact & FAQ — KRYVO",
            description: desc,
            path,
          }),
          faqPageSchema(
            contactFaqs.map((f) => ({ question: f.q, answer: f.a })),
          ),
        ]}
      />
      <Contact />
    </>
  );
}
