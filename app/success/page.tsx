import type { Metadata } from "next";
import SuccessPage from "@/views/SuccessPage";
import { getSiteUrl } from "@/lib/site";

const canonical = `${getSiteUrl()}/success`;

export const metadata: Metadata = {
  title: "Order complete",
  description:
    "Thank you for your purchase at KRYVO. Order confirmation is sent by email.",
  robots: { index: false, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "Thank you — KRYVO",
    description: "Your order was placed successfully.",
    url: canonical,
  },
};

export default function Success() {
  return <SuccessPage />;
}
