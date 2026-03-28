import { getCheckoutOrigin } from "@/lib/site";

const DEFAULT_API_VERSION = "2025-07";

/**
 * Normalizes shop domain from env (handles pasted URLs like https://shop.myshopify.com/...).
 */
export function normalizeShopifyDomain(raw: string): string {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = (d.split("/")[0] ?? d).trim();
  if (!d || !d.includes(".")) {
    throw new Error(
      "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN must be your store hostname (e.g. kryvo-store.myshopify.com), no https://",
    );
  }
  return d;
}

/** Server-side Shopify GraphQL URL + token (SSR, API route, sitemap). Not used in the browser. */
export function getStorefrontEndpoint(): { url: string; token: string } {
  const rawDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.SHOPIFY_STOREFRONT_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN?.trim();
  if (!rawDomain?.trim() || !token) {
    throw new Error(
      "Shopify Storefront: set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN (or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN). See .env.example.",
    );
  }
  const domain = normalizeShopifyDomain(rawDomain);
  const version =
    process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || DEFAULT_API_VERSION;
  return {
    url: `https://${domain}/api/${version}/graphql.json`,
    token,
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Rewrites Cart API checkout URL to your checkout domain (e.g. shop.kryvo.store). */
export function normalizeCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    const target = new URL(getCheckoutOrigin());
    url.protocol = target.protocol;
    url.host = target.host;
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/** Raw GraphQL envelope from Shopify or /api/storefront proxy. */
export type StorefrontGraphQLResult = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- GraphQL shape varies by query
  data?: any;
  errors?: { message: string }[];
};

export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<StorefrontGraphQLResult> {
  const requestBody = JSON.stringify({ query, variables });

  // Browser → same-origin API proxy (avoids Shopify CORS). Use absolute URL so nested routes / previews resolve correctly.
  const response = isBrowser()
    ? await fetch(`${window.location.origin}/api/storefront`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      })
    : await (() => {
        const { url, token } = getStorefrontEndpoint();
        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
          },
          body: requestBody,
        });
      })();

  const text = await response.text();
  let payload: StorefrontGraphQLResult;
  try {
    payload = text ? (JSON.parse(text) as StorefrontGraphQLResult) : {};
  } catch {
    throw new Error(
      `Shopify proxy returned non-JSON (HTTP ${response.status}). Confirm /api/storefront exists and Next.js is running from the project root. Body: ${text.slice(0, 160)}`,
    );
  }

  if (response.status === 402) {
    throw new Error(
      "Shopify: store billing required. Check your Shopify plan in admin.",
    );
  }

  if (payload.errors?.length) {
    throw new Error(
      `Shopify GraphQL: ${payload.errors.map((e) => e.message).join(", ")}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `Shopify HTTP ${response.status}. Check Storefront token and domain in env (Vercel: Production env vars).`,
    );
  }

  return payload;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml?: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice?: {
            amount: string;
            currencyCode: string;
          } | null;
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      productType
      vendor
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

/** Optional: fetch collections for navigation or landing sections */
export const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>,
): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

export async function createShopifyCart(
  item: CartItem,
  customerAccessToken?: string | null,
): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const input: Record<string, unknown> = {
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  };

  if (customerAccessToken) {
    input.buyerIdentity = { customerAccessToken };
  }

  const data = await storefrontApiRequest(CART_CREATE_MUTATION, { input });

  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error("Cart creation failed:", data.data.cartCreate.userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return {
    cartId: cart.id,
    checkoutUrl: normalizeCheckoutUrl(cart.checkoutUrl),
    lineId,
  };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: CartItem,
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors))
    return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find(
    (l: {
      node: { id: string; merchandise: { id: string } };
    }) => l.node.merchandise.id === item.variantId,
  );
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors))
    return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors))
    return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: $customer
    ) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export type CustomerProfileUpdateInput = {
  firstName: string;
  lastName: string;
  email: string;
  /** E.164 recommended, e.g. +919061061442. Empty string clears the phone. */
  phone: string;
};

export async function updateCustomerProfile(
  customerAccessToken: string,
  customer: CustomerProfileUpdateInput,
) {
  const phoneTrimmed = customer.phone.trim();
  const data = await storefrontApiRequest(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken,
    customer: {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      email: customer.email.trim(),
      phone: phoneTrimmed.length > 0 ? phoneTrimmed : null,
    },
  });
  const payload = data?.data?.customerUpdate;
  if (payload?.customerUserErrors?.length > 0) {
    throw new Error(payload.customerUserErrors[0].message);
  }
  return {
    customer: payload?.customer ?? null,
    customerAccessToken: payload?.customerAccessToken as
      | { accessToken: string; expiresAt: string }
      | null
      | undefined,
  };
}

export const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      defaultAddress {
        address1
        address2
        city
        province
        zip
        country
      }
      orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function loginCustomer(email: string, password: string) {
  const data = await storefrontApiRequest(
    CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    {
      input: { email, password },
    },
  );
  const authData = data?.data?.customerAccessTokenCreate;
  if (authData?.customerUserErrors?.length > 0) {
    throw new Error(authData.customerUserErrors[0].message);
  }
  return authData?.customerAccessToken;
}

export async function registerCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const data = await storefrontApiRequest(CUSTOMER_CREATE_MUTATION, {
    input: { email, password, firstName, lastName },
  });
  const createData = data?.data?.customerCreate;
  if (createData?.customerUserErrors?.length > 0) {
    throw new Error(createData.customerUserErrors[0].message);
  }
  return createData?.customer;
}

export async function getCustomerData(accessToken: string) {
  const data = await storefrontApiRequest(GET_CUSTOMER_QUERY, {
    customerAccessToken: accessToken,
  });
  return data?.data?.customer || null;
}

/** Server-safe fetch for metadata (e.g. generateMetadata). */
export async function fetchProductByHandle(handle: string) {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.data?.product ?? null;
}

export const SITEMAP_PRODUCTS_QUERY = `
  query SitemapProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`;

/** For sitemap.xml; returns empty array if Storefront env is missing or request fails. */
export async function fetchProductHandlesForSitemap(): Promise<
  { handle: string; updatedAt: string }[]
> {
  try {
    const data = await storefrontApiRequest(SITEMAP_PRODUCTS_QUERY, {
      first: 250,
    });
    const edges = data?.data?.products?.edges ?? [];
    return edges.map(
      (e: { node: { handle: string; updatedAt: string } }) => ({
        handle: e.node.handle,
        updatedAt: e.node.updatedAt,
      }),
    );
  } catch {
    return [];
  }
}
