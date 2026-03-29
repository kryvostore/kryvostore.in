"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizePincodeInput, isValidIndiaPincode } from "@/lib/india-pincode";

interface PincodeDeliveryCheckProps {
  /** When false, we still confirm the area but warn that the SKU is unavailable. */
  variantAvailable: boolean;
}

export function PincodeDeliveryCheck({
  variantAvailable,
}: PincodeDeliveryCheckProps) {
  const [raw, setRaw] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const pin = normalizePincodeInput(raw);

  const check = async () => {
    if (!isValidIndiaPincode(pin)) {
      setStatus("error");
      setMessage("Enter a 6-digit PIN.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch(`/api/pincode?pin=${encodeURIComponent(pin)}`);
      const data = await res.json();

      if (!data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Try again.");
        return;
      }

      const place = [data.area, data.district, data.state]
        .filter(Boolean)
        .join(", ");

      setStatus("done");

      if (!variantAvailable) {
        setMessage(`Delivers to ${place} — item sold out.`);
        return;
      }

      setMessage(`Delivers to ${place} · ~5–10 days · free shipping`);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="mb-5 rounded-2xl border border-border/50 bg-secondary/20 dark:bg-secondary/10 px-3 py-2.5">
      <p className="text-[11px] font-medium text-foreground/90 mb-1.5 flex items-center gap-1.5">
        <MapPin className="h-3 w-3 shrink-0" aria-hidden />
        PIN · delivery check
      </p>
      <div className="flex gap-2">
        <Input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="673008"
          value={raw}
          onChange={(e) => setRaw(normalizePincodeInput(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
          className="h-9 text-[12px] rounded-lg bg-background"
          aria-label="Indian PIN code"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-9 shrink-0 rounded-lg px-3 text-[12px]"
          onClick={check}
          disabled={status === "loading" || pin.length !== 6}
        >
          {status === "loading" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Check"
          )}
        </Button>
      </div>
      {message && (
        <p
          className={`mt-1.5 text-[10px] leading-snug ${
            status === "error"
              ? "text-destructive"
              : !variantAvailable && status === "done"
                ? "text-amber-700 dark:text-amber-400"
                : "text-emerald-700 dark:text-emerald-400"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
