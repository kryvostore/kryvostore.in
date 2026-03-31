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

export function getTrackingStepByFulfillment(
  fulfillmentStatus: string | null | undefined,
): number {
  const f = (fulfillmentStatus ?? "").toUpperCase();
  switch (f) {
    case "FULFILLED":
      return 3;
    case "PARTIALLY_FULFILLED":
      return 2;
    case "UNFULFILLED":
    default:
      return 1;
  }
}
