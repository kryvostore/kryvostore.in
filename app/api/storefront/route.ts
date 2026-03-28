import { NextRequest, NextResponse } from "next/server";
import { getStorefrontEndpoint } from "@/lib/shopify";

/**
 * Proxies Storefront API GraphQL to Shopify server-side.
 * Browsers cannot call *.myshopify.com/graphql directly (CORS); the app uses this route instead.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, variables } = body as {
      query?: string;
      variables?: Record<string, unknown>;
    };

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { errors: [{ message: "Invalid request: missing GraphQL query" }] },
        { status: 400 },
      );
    }

    const { url, token } = getStorefrontEndpoint();
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables: variables ?? {} }),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    console.error("[api/storefront]", e);
    const message = e instanceof Error ? e.message : "Storefront proxy error";
    return NextResponse.json({ errors: [{ message }] }, { status: 500 });
  }
}
