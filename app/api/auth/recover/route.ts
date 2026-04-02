import { NextRequest, NextResponse } from "next/server";
import { storefrontApiRequest, CUSTOMER_RECOVER_MUTATION } from "@/lib/shopify";

export const runtime = "nodejs";

function isLikelyCustomerNotFound(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("could not find customer") ||
    m.includes("customer not found") ||
    m.includes("not found") ||
    m.includes("does not exist") ||
    m.includes("no account")
  );
}

/** Password recovery via Shopify `customerRecover` only (no custom provider). */
export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = (await req.json()) as { email?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Valid email required" }, { status: 400 });
  }

  try {
    const data = await storefrontApiRequest(CUSTOMER_RECOVER_MUTATION, { email });
    const errors = data?.data?.customerRecover?.customerUserErrors ?? [];
    // Always return generic success to prevent email enumeration.
    // Shopify handles delivery policy/behavior.
    if (errors.length > 0) {
      const msg = errors[0]?.message ?? "";
      if (!isLikelyCustomerNotFound(msg)) {
        console.warn("[auth/recover] Shopify customerRecover warning:", msg);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[auth/recover]", e);
    // Still return generic success to avoid leaking whether email exists
    return NextResponse.json({ ok: true });
  }
}
