function titleCaseEnum(s: string): string {
  return s
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export type OrderStatusView = {
  label: string;
  className: string;
};

export function getOrderStatusView(
  fulfillmentStatus: string | null | undefined,
  financialStatus: string | null | undefined,
  canceledAt?: string | null,
): OrderStatusView {
  const f = (fulfillmentStatus ?? "").toUpperCase();
  const p = (financialStatus ?? "").toUpperCase();

  if (canceledAt || p === "VOIDED") {
    return {
      label: "Canceled",
      className: "bg-red-100 text-red-700",
    };
  }

  if (f === "FULFILLED") {
    return {
      label: "Delivered",
      className: "bg-green-100 text-green-700",
    };
  }

  if (f === "PARTIALLY_FULFILLED") {
    return {
      label: "Partially shipped",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  if (p === "PAID" || p === "PARTIALLY_PAID") {
    return {
      label: "Processing",
      className: "bg-blue-100 text-blue-700",
    };
  }

  if (p === "PENDING") {
    return {
      label: "Payment pending",
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    label: "Unfulfilled",
    className: "bg-secondary text-muted-foreground",
  };
}

/** Human-readable labels for Shopify `OrderFulfillmentStatus` (Storefront API). */
export function humanizeFulfillmentStatus(
  fulfillmentStatus: string | null | undefined,
): string {
  const f = (fulfillmentStatus ?? "").toUpperCase();
  const map: Record<string, string> = {
    FULFILLED: "Delivered",
    PARTIALLY_FULFILLED: "Partially shipped",
    UNFULFILLED: "Not yet shipped",
    IN_PROGRESS: "In progress",
    ON_HOLD: "On hold",
    SCHEDULED: "Scheduled",
    PENDING_FULFILLMENT: "Awaiting fulfillment",
    OPEN: "Unfulfilled",
    RESTOCKED: "Restocked",
  };
  return map[f] ?? titleCaseEnum(f);
}

/** Human-readable labels for Shopify `OrderFinancialStatus`. */
export function humanizeFinancialStatus(
  financialStatus: string | null | undefined,
): string {
  const p = (financialStatus ?? "").toUpperCase();
  const map: Record<string, string> = {
    PAID: "Paid",
    PENDING: "Payment pending",
    AUTHORIZED: "Authorized",
    PARTIALLY_PAID: "Partially paid",
    PARTIALLY_REFUNDED: "Partially refunded",
    REFUNDED: "Refunded",
    VOIDED: "Voided",
    EXPIRED: "Expired",
  };
  return map[p] ?? titleCaseEnum(p);
}

export function humanizeCancelReason(
  reason: string | null | undefined,
): string | null {
  if (!reason) return null;
  const r = reason.toUpperCase();
  const map: Record<string, string> = {
    CUSTOMER: "Customer request",
    DECLINED: "Payment declined",
    FRAUD: "Fraud",
    INVENTORY: "Inventory",
    STAFF: "Staff",
    OTHER: "Other",
  };
  return map[r] ?? reason;
}

export function getTrackingStepByFulfillment(
  fulfillmentStatus: string | null | undefined,
): number {
  const f = (fulfillmentStatus ?? "").toUpperCase();
  switch (f) {
    case "FULFILLED":
      return 3;
    case "RESTOCKED":
      return 1;
    case "PARTIALLY_FULFILLED":
    case "IN_PROGRESS":
      return 2;
    case "UNFULFILLED":
    case "ON_HOLD":
    case "SCHEDULED":
    case "PENDING_FULFILLMENT":
    case "OPEN":
    default:
      return 1;
  }
}

export type LineItemShipStatus = "canceled" | "shipped" | "partial" | "pending";

export function getLineItemShipStatus(
  canceledAt: string | null | undefined,
  currentQuantity: number,
  fulfilledQty: number,
): LineItemShipStatus {
  if (canceledAt) return "canceled";
  if (currentQuantity <= 0) return "canceled";
  if (fulfilledQty >= currentQuantity) return "shipped";
  if (fulfilledQty > 0) return "partial";
  return "pending";
}

export function labelForLineItemShipStatus(
  status: LineItemShipStatus,
): string {
  switch (status) {
    case "canceled":
      return "Canceled";
    case "shipped":
      return "Shipped";
    case "partial":
      return "Partially shipped";
    default:
      return "Awaiting shipment";
  }
}

export function aggregateFulfilledQtyByLineItemId(
  fulfillments: Array<{
    fulfillmentLineItems?: {
      edges?: Array<{
        node: { quantity: number; lineItem: { id: string } };
      }>;
    };
  } | null>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const f of fulfillments) {
    if (!f) continue;
    const edges = f.fulfillmentLineItems?.edges ?? [];
    for (const e of edges) {
      const id = e.node.lineItem.id;
      counts[id] = (counts[id] ?? 0) + e.node.quantity;
    }
  }
  return counts;
}
