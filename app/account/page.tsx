import type { Metadata } from "next";
import Account from "@/views/Account";
import { getSiteUrl } from "@/lib/site";

const canonical = `${getSiteUrl()}/account`;

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Sign in to view your KRYVO profile, saved addresses, and recent orders (Shopify customer account).",
  robots: { index: false, follow: true },
  alternates: { canonical },
};

export default function AccountPage() {
  return <Account />;
}
