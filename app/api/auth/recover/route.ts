import { NextRequest, NextResponse } from "next/server";
import { storefrontApiRequest, CUSTOMER_RECOVER_MUTATION } from "@/lib/shopify";
import { sendPasswordRecoveryFallback } from "@/lib/password-recovery-resend";

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

/**
 * Password recovery: Shopify `customerRecover` first; if it fails, optionally
 * notify the user via Resend (RESEND_API_KEY + RESEND_FROM).
 * Response is always generic success for callers (no email enumeration).
 */
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

    if (errors.length === 0) {
      return NextResponse.json({ ok: true, channel: "shopify" });
    }

    const msg = errors[0]?.message ?? "Unknown error";
    const notFound = isLikelyCustomerNotFound(msg);

    const fallback = await sendPasswordRecoveryFallback(
      email,
      notFound ? "not_found" : "shopify_error",
    );

    return NextResponse.json({
      ok: true,
      channel: fallback.sent ? "resend" : "none",
      // omit details in production — helps debugging only when needed
    });
  } catch (e) {
    const fallback = await sendPasswordRecoveryFallback(email, "shopify_error");
    if (fallback.sent) {
      return NextResponse.json({ ok: true, channel: "resend" });
    }
    console.error("[auth/recover]", e);
    // Still return generic success to avoid leaking whether email exists
    return NextResponse.json({ ok: true, channel: "none" });
  }
}
