import type { Metadata } from "next";
import ContactInformation from "@/views/ContactInformation";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/site";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

const path = "/contact-information";
const canonical = `${getSiteUrl()}${path}`;
const desc =
  "Legal contact information for kryvostore: email, phone, and registered address.";

export const metadata: Metadata = {
  title: "Contact information",
  description: desc,
  keywords: [...DEFAULT_KEYWORDS, "contact", "legal", "address"],
  alternates: { canonical },
  openGraph: {
    title: "Contact information — KRYVO",
    description: desc,
    url: canonical,
  },
};

export default function ContactInformationPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Contact information — KRYVO",
          description: desc,
          path,
        })}
      />
      <ContactInformation />
    </>
  );
}
