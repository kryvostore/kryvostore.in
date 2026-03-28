import type { Metadata } from "next";
import ProductPage from "@/views/ProductPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCachedProductByHandle } from "@/lib/shopify/product-cache";
import { getSiteUrl } from "@/lib/site";
import { breadcrumbListSchema, productSchema } from "@/lib/seo/schema";
import {
  DEFAULT_KEYWORDS,
  SITE_NAME,
  getDefaultOgImage,
  getTwitterHandle,
} from "@/lib/seo/config";
import { buildProductMetaDescription } from "@/lib/seo/product-meta";
import {
  getFirstVariantFeaturedImageUrl,
  productSocialExtraMeta,
  resolveProductOgImages,
} from "@/lib/seo/social-meta";

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
  const canonical = `${site}/product/${params.slug}`;
  const description = buildProductMetaDescription({
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    productType: product.productType,
  });

  const tags = Array.isArray(product.tags) ? product.tags : [];
  const keywords = Array.from(
    new Set(
      [
        product.title,
        product.productType,
        product.vendor,
        ...tags,
        "buy online",
        SITE_NAME,
        ...DEFAULT_KEYWORDS,
      ].filter(Boolean) as string[],
    ),
  ).slice(0, 24);

  const fallbackOg = getDefaultOgImage();
  const variantHero = getFirstVariantFeaturedImageUrl(product);
  const ogResolved = resolveProductOgImages(
    product.images?.edges,
    product.title,
    fallbackOg,
    site,
    4,
    variantHero,
  );
  const ogImages = ogResolved.map((img) => ({
    url: img.url,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }));

  const primary = ogResolved[0];
  const minP = product.priceRange?.minVariantPrice;
  const available =
    product.variants?.edges?.some((e) => e.node.availableForSale) ?? false;

  const ogTitle = `${product.title} — ${SITE_NAME}`;
  const tw = getTwitterHandle();

  const other: Record<string, string> = {
    ...(minP && {
      "product:price:amount": minP.amount,
      "product:price:currency": minP.currencyCode,
      "og:price:amount": minP.amount,
      "og:price:currency": minP.currencyCode,
    }),
    "product:availability": available ? "in stock" : "out of stock",
    "product:condition": "new",
    "product:retailer": SITE_NAME,
    ...(product.vendor?.trim() && { "product:brand": product.vendor.trim() }),
    ...productSocialExtraMeta(primary.url),
  };

  return {
    title: product.title,
    description,
    keywords,
    authors: [{ name: SITE_NAME, url: site }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    category: product.productType?.trim() || "shopping",
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: {
        url: primary.url,
        alt: primary.alt,
      },
      ...(tw && { site: tw, creator: tw }),
    },
    robots: { index: true, follow: true },
    other,
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
