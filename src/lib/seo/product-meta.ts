import { SITE_NAME } from "@/lib/seo/config";

export function stripHtmlForMeta(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

type ProductDescSource = {
  title: string;
  description?: string | null;
  descriptionHtml?: string | null;
  productType?: string | null;
};

/** SERP / OG / Twitter body text (aim ≤320 chars, unique). */
export function buildProductMetaDescription(product: ProductDescSource): string {
  const plain = stripHtmlForMeta(product.description || "");
  const fromHtml = stripHtmlForMeta(product.descriptionHtml || "");
  const body = (plain || fromHtml).slice(0, 240);
  const typeSuffix = product.productType?.trim()
    ? ` ${product.productType.trim()}.`
    : "";
  const out = body
    ? `${body}${typeSuffix} Buy ${product.title} at ${SITE_NAME}.`
    : `Shop ${product.title} online at ${SITE_NAME}.${typeSuffix}`;
  return out.slice(0, 320);
}
