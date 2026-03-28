"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);

  const checkoutId =
    searchParams?.get("checkout_id") ?? searchParams?.get("session_id");

  useEffect(() => {
    if (checkoutId) clearCart();
  }, [checkoutId, clearCart]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-emerald-500/10 p-6 mb-8">
        <CheckCircle2 className="h-16 w-16 text-emerald-600" />
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-light tracking-tight mb-4">
        Thank you for your order
      </h1>
      <p className="text-muted-foreground max-w-md mb-2">
        Your payment was processed on Shopify checkout. Confirmation details are
        sent to your email.
      </p>
      {checkoutId ? (
        <p className="text-xs text-muted-foreground/80 mb-8 font-mono">
          Reference: {checkoutId.slice(0, 48)}
          {checkoutId.length > 48 ? "…" : ""}
        </p>
      ) : (
        <div className="mb-8" />
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="rounded-full" size="lg">
          <Link href="/collections">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full" size="lg">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-24">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
