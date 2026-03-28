import type { Metadata } from "next";
import ProductPage from "@/views/ProductPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCachedProductByHandle } from "@/lib/shopify/product-cache";
import { getSiteUrl } from "@/lib/site";
import {
  breadcrumbListSchema,
  productSchema,
} from "@/lib/seo/schema";
import { DEFAULT_KEYWORDS } from "@/lib/seo/config";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getCachedProductByHandle(params.slug);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: true },
    };
  }
  const site = getSiteUrl();
  const desc = (product.description || "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 160);
  const image = product.images?.edges?.[0]?.node?.url;
  const price = product.variants?.edges?.[0]?.node?.price;
  const title = `${product.title} — Buy online`;
  return {
    title: product.title,
    description: desc || `Shop ${product.title} at KRYVO. Premium tech and lifestyle products.`,
    keywords: [
      product.title,
      "KRYVO",
      "buy online",
      ...DEFAULT_KEYWORDS.slice(0, 4),
    ],
    openGraph: {
      title,
      description: desc,
      url: `${site}/product/${params.slug}`,
      images: image ? [{ url: image, alt: product.title }] : [],
      type: "website",
      siteName: "KRYVO STORE",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: image ? [image] : undefined,
    },
    alternates: { canonical: `${site}/product/${params.slug}` },
    robots: { index: true, follow: true },
    ...(price && {
      other: {
        "product:price:amount": price.amount,
        "product:price:currency": price.currencyCode,
      },
    }),
  };
}

export default async function ProductRoute({ params }: Props) {
  const product = await getCachedProductByHandle(params.slug);
  if (!product) {
    return <ProductPage />;
  }

  const structured = [
    productSchema(product),
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Shop", path: "/collections" },
      { name: product.title, path: `/product/${params.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structured} />
      <ProductPage />
    </>
  );
}
