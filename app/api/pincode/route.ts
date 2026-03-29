import { NextResponse } from "next/server";
import { isValidIndiaPincode } from "@/lib/india-pincode";

type PostalApiResponse = {
  Status?: string;
  Message?: string;
  PostOffice?: Array<{
    Name?: string;
    District?: string;
    State?: string;
    Block?: string;
  }>;
};

/**
 * Proxies India Post PIN lookup (avoids browser CORS). Used for delivery area check on PDP.
 * @see https://www.postalpincode.in/Api-Details
 */
export async function GET(request: Request) {
  const pin = new URL(request.url).searchParams.get("pin")?.trim() ?? "";

  if (!isValidIndiaPincode(pin)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid 6-digit PIN code." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${encodeURIComponent(pin)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (compatible; KRYVOStorefront/1.0; +https://kryvo.store)",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "Could not verify PIN. Try again." },
        { status: 502 },
      );
    }

    const raw = await res.json();
    // API sometimes returns [{ Status, PostOffice }] and sometimes { Status, PostOffice }
    const data = (Array.isArray(raw) ? raw[0] : raw) as PostalApiResponse;

    const statusOk =
      String(data.Status ?? "")
        .trim()
        .toLowerCase() === "success";

    if (!statusOk || !data.PostOffice?.length) {
      return NextResponse.json({
        ok: false,
        error: "PIN not found. Try again.",
      });
    }

    const first = data.PostOffice[0];
    return NextResponse.json({
      ok: true,
      pin,
      area: first.Name ?? "",
      district: first.District ?? "",
      state: first.State ?? "",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Network error. Try again." },
      { status: 502 },
    );
  }
}
