"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const {
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  useEffect(() => {
    syncCart();
  }, [syncCart]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.location.assign(checkoutUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <h1 className="font-display text-3xl font-light tracking-tight mb-2">
          Your cart
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          {totalItems === 0
            ? "Your cart is empty"
            : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-border/50 bg-secondary/20">
            <ShoppingCart className="h-14 w-14 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-6">Nothing here yet.</p>
            <Button asChild className="rounded-full">
              <Link href="/collections">Browse products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-10">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/30"
                >
                  <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.node.images?.edges?.[0]?.node.url && (
                      <Image
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.node.handle}`}
                      className="font-medium text-sm hover:underline line-clamp-2"
                    >
                      {item.product.node.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.selectedOptions.map((o) => o.value).join(" · ")}
                    </p>
                    <p className="font-semibold text-sm mt-2">
                      {item.price.currencyCode}{" "}
                      {parseFloat(item.price.amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-border/50 p-6 bg-card/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-display font-semibold">Total</span>
                <span className="text-2xl font-bold">
                  {items[0]?.price.currencyCode || "$"}{" "}
                  {totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full rounded-full h-12"
                size="lg"
                disabled={isLoading || isSyncing}
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Checkout on shop.kryvo.store
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                You will complete payment on our secure checkout. After
                purchase, you can return to kryvo.store.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
