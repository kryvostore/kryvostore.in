import { NextRequest, NextResponse } from "next/server";
import { getStorefrontEndpoint } from "@/lib/shopify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Quick check: GET /api/storefront → should be JSON, not 404 (confirms route is registered). */
export async function GET() {
  try {
    getStorefrontEndpoint();
    return NextResponse.json({
      ok: true,
      route: "storefront-proxy",
      configured: true,
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: true,
        route: "storefront-proxy",
        configured: false,
        hint: e instanceof Error ? e.message : "Set Shopify env vars",
      },
      { status: 200 },
    );
  }
}

/** Preflight (rare for same-origin; helps some proxies / tools). */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "GET, POST, OPTIONS" },
  });
}

/**
 * Proxies Storefront API GraphQL to Shopify server-side.
 * Browsers must not call *.myshopify.com directly (CORS).
 */
export async function POST(req: NextRequest) {
  let url: string;
  let token: string;
  try {
    const ep = getStorefrontEndpoint();
    url = ep.url;
    token = ep.token;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Shopify env not configured";
    return NextResponse.json({ errors: [{ message }] }, { status: 503 });
  }

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

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables: variables ?? {} }),
    });

    const text = await upstream.text();
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json(
        {
          errors: [
            {
              message: `Shopify returned non-JSON (HTTP ${upstream.status})`,
            },
          ],
        },
        { status: 502 },
      );
    }

    return NextResponse.json(parsed, { status: upstream.status });
  } catch (e) {
    console.error("[api/storefront]", e);
    const message = e instanceof Error ? e.message : "Storefront proxy error";
    return NextResponse.json({ errors: [{ message }] }, { status: 500 });
  }
}
