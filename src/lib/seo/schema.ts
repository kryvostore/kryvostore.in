import { getSiteUrl } from "@/lib/site";
import {
  DEFAULT_DESCRIPTION,
  getDefaultOgImage,
  getSiteLogoUrl,
  SITE_NAME,
  SITE_NAME_SHORT,
} from "@/lib/seo/config";

const sameAsFromEnv = (): string[] => {
  const raw = process.env.NEXT_PUBLIC_ORGANIZATION_SAME_AS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export function organizationSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_NAME_SHORT,
    url,
    logo: {
      "@type": "ImageObject",
      url: getSiteLogoUrl(),
    },
    image: getDefaultOgImage(),
    description: DEFAULT_DESCRIPTION,
    sameAs: sameAsFromEnv(),
  };
}

export function webSiteSchema() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: SITE_NAME,
    url,
    publisher: { "@id": `${url}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/collections?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webPageSchema(args: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  const url = getSiteUrl() + args.path;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name: args.name,
    description: args.description,
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    about: { "@id": `${getSiteUrl()}/#organization` },
    ...(args.dateModified && { dateModified: args.dateModified }),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: getDefaultOgImage(),
    },
  };
}

export function breadcrumbListSchema(
  items: { name: string; path: string }[],
) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

type ProductLike = {
  title: string;
  description?: string | null;
  handle: string;
  images?: { edges: { node: { url: string; altText?: string | null } }[] };
  variants?: {
    edges: {
      node: {
        id: string;
        price: { amount: string; currencyCode: string };
        availableForSale?: boolean;
      };
    }[];
  };
};

export function productSchema(product: ProductLike) {
  const site = getSiteUrl();
  const url = `${site}/product/${product.handle}`;
  const images =
    product.images?.edges?.map((e) => e.node.url).filter(Boolean) ?? [];
  const variant = product.variants?.edges?.[0]?.node;
  const price = variant?.price;
  const availability = variant?.availableForSale
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const plainDesc = (product.description || "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 5000);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}/#product`,
    name: product.title,
    description: plainDesc || product.title,
    url,
    sku: variant?.id?.split("/").pop(),
    image: images.length ? images : [getDefaultOgImage()],
    brand: {
      "@type": "Brand",
      name: SITE_NAME_SHORT,
    },
    offers: price
      ? {
          "@type": "Offer",
          url,
          priceCurrency: price.currencyCode,
          price: price.amount,
          availability,
          seller: { "@id": `${site}/#organization` },
          priceValidUntil: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000,
          ).toISOString().slice(0, 10),
        }
      : undefined,
  };
}

export function faqPageSchema(
  entries: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
