import type { Metadata } from "next";
import CartPage from "@/views/CartPage";
import { getSiteUrl } from "@/lib/site";

const canonical = `${getSiteUrl()}/cart`;

export const metadata: Metadata = {
  title: "Shopping cart",
  description:
    "Review items in your KRYVO cart and continue to secure checkout on Shopify.",
  robots: { index: false, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "Your cart — KRYVO",
    description: "Review your bag before checkout.",
    url: canonical,
  },
};

export default function Cart() {
  return <CartPage />;
}
