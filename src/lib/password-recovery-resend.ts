import { Resend } from "resend";
import { getSiteUrl } from "@/lib/site";

export type RecoveryFallbackReason = "not_found" | "shopify_error";

/**
 * Sends a fallback email via Resend when Shopify `customerRecover` did not succeed.
 * Requires RESEND_API_KEY and RESEND_FROM (verified sender in Resend).
 */
export async function sendPasswordRecoveryFallback(
  to: string,
  reason: RecoveryFallbackReason,
): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!key || !from) {
    return { sent: false, error: "Resend not configured" };
  }

  const site = getSiteUrl();
  const forgotUrl = `${site}/account/forgot-password`;
  const collectionsUrl = `${site}/collections`;

  const subject =
    reason === "not_found"
      ? "KRYVO — no account for this email"
      : "KRYVO — password reset";

  const html =
    reason === "not_found"
      ? `
<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:480px;">
  <p>Hi,</p>
  <p>We couldn’t find a store account linked to <strong>${escapeHtml(to)}</strong>.</p>
  <p>If you expected an account here, you may have used a different email, or you can create one at checkout.</p>
  <p><a href="${collectionsUrl}" style="color:#111;">Browse the store</a></p>
  <p style="color:#666;font-size:13px;">— KRYVO</p>
</body></html>`
      : `
<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:480px;">
  <p>Hi,</p>
  <p>We couldn’t send the automated password-reset email from our store system just now.</p>
  <p>Please try again from our site:</p>
  <p><a href="${forgotUrl}" style="color:#111;font-weight:600;">${forgotUrl}</a></p>
  <p style="color:#666;font-size:13px;">If this keeps happening, reply to our contact page and we’ll help you sign in.</p>
  <p style="color:#666;font-size:13px;">— KRYVO</p>
</body></html>`;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    if (error) {
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Resend send failed";
    return { sent: false, error: msg };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
