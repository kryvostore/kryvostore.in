"use client";

import { Truck } from "lucide-react";
import type { CartItem } from "@/lib/shopify";
import {
  computeCartOrderSummary,
  SEPARATE_PACKAGES_NOTE,
} from "@/lib/cart-order-summary";
import { cn } from "@/lib/utils";

type CartOrderSummaryProps = {
  items: CartItem[];
  /** Tighter spacing for the cart drawer */
  variant?: "default" | "compact";
  showBanner?: boolean;
};

export function CartOrderSummary({
  items,
  variant = "default",
  showBanner = true,
}: CartOrderSummaryProps) {
  if (items.length === 0) return null;

  const { currencyCode, subtotal, total } = computeCartOrderSummary(items);
  const money = (n: number) => `${currencyCode} ${n.toFixed(2)}`;

  const compact = variant === "compact";

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      {showBanner && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-2xl border border-border/50 bg-secondary/40 px-4 py-3 text-sm",
            compact && "px-3 py-2.5 rounded-xl text-[13px]",
          )}
        >
          <Truck
            className={cn(
              "h-4 w-4 shrink-0 text-foreground/80",
              compact && "h-3.5 w-3.5",
            )}
            aria-hidden
          />
          <span className="font-medium text-foreground">
            Free shipping on all orders
          </span>
        </div>
      )}

      <div className={cn("space-y-3", compact && "space-y-2")}>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground tabular-nums">{money(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
            FREE
          </span>
        </div>
        <div
          className={cn(
            "flex justify-between items-baseline pt-3 border-t border-border/40",
            compact && "pt-2",
          )}
        >
          <span
            className={cn(
              "font-display font-semibold text-foreground",
              compact ? "text-base" : "text-lg",
            )}
          >
            Total
          </span>
          <span
            className={cn(
              "font-bold tabular-nums text-foreground",
              compact ? "text-xl" : "text-2xl",
            )}
          >
            {money(total)}
          </span>
        </div>
      </div>

      <p
        className={cn(
          "text-xs text-muted-foreground leading-relaxed",
          compact && "text-[11px]",
        )}
      >
        {SEPARATE_PACKAGES_NOTE}
      </p>
    </div>
  );
}
