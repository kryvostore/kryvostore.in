import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  price?: string;
  currency?: string;
}

export const SEO = ({
  title,
  description,
  image = "https://kryvo.store/og-banner.png",
  url = "https://kryvo.store",
  type = "website",
  price,
  currency = "INR",
}: SEOProps) => {
  const siteTitle = `${title} | KRYVO`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="KRYVO STORE" />

      {/* Product Specific Metadata (Crucial for Shopify/E-commerce SEO) */}
      {type === "product" && price && (
        <meta property="product:price:amount" content={price} />
      )}
      {type === "product" && currency && (
        <meta property="product:price:currency" content={currency} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* AEO / Schema.org Context (Helps AI Search Engines like Perplexity/ChatGPT/Google SGE) */}
      <script type="application/ld+json">
        {JSON.stringify(
          type === "product"
            ? {
                "@context": "https://schema.org/",
                "@type": "Product",
                name: title,
                image: image,
                description: description,
                brand: {
                  "@type": "Brand",
                  name: "KRYVO",
                },
                offers: {
                  "@type": "Offer",
                  url: url,
                  priceCurrency: currency,
                  price: price || "0.00",
                  availability: "https://schema.org/InStock",
                  seller: {
                    "@type": "Organization",
                    name: "KRYVO STORE",
                  },
                },
              }
            : {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "KRYVO",
                url: url,
                logo: "https://kryvo.store/og-banner.png",
                description: "Premium tech accessories and lifestyle products.",
              }
        )}
      </script>
    </Helmet>
  );
};
