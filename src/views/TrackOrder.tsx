"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Search,
	Package,
	Truck,
	CheckCircle,
	Clock,
	Loader2,
	AlertCircle,
	ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getCustomerData } from "@/lib/shopify";
import {
	aggregateFulfilledQtyByLineItemId,
	getLineItemShipStatus,
	getOrderStatusView,
	getTrackingStepByFulfillment,
	humanizeCancelReason,
	humanizeFinancialStatus,
	humanizeFulfillmentStatus,
	labelForLineItemShipStatus,
} from "@/lib/order-status";

const steps = [
	{
		icon: Package,
		label: "Order Confirmed",
		desc: "Your order has been received and verified by our system.",
	},
	{
		icon: Clock,
		label: "Processing Phase",
		desc: "Our logistics team is currently preparing your package.",
	},
	{
		icon: Truck,
		label: "Shipped & In Transit",
		desc: "Your order is en route to the final destination.",
	},
	{
		icon: CheckCircle,
		label: "Successfully Delivered",
		desc: "The package has been securely delivered.",
	},
];

type TrackLineItem = {
	id: string;
	title: string;
	quantity: number;
	currentQuantity: number;
	imageUrl: string | null;
	imageAlt: string | null;
	variantTitle: string | null;
	fulfilledQty: number;
};

type TrackFulfillment = {
	trackingCompany: string | null;
	tracking: Array<{ number: string | null; url: string | null }>;
	lines: Array<{ title: string; quantity: number }>;
};

type TrackResult =
	| null
	| { kind: "not_found" }
	| { kind: "need_login" }
	| {
			kind: "found";
			orderNumber: number;
			fulfillmentStatus: string;
			financialStatus: string | null;
			canceledAt: string | null;
			cancelReason: string | null;
			processedAt: string;
			statusUrl: string;
			totalPrice: { amount: string; currencyCode: string };
			lineItems: TrackLineItem[];
			fulfillments: TrackFulfillment[];
	  };

function mapCustomerOrderToResult(order: {
	orderNumber: number;
	fulfillmentStatus: string | null;
	financialStatus: string | null;
	canceledAt: string | null;
	cancelReason: string | null;
	processedAt: string;
	statusUrl: string;
	totalPrice: { amount: string; currencyCode: string };
	lineItems?: {
		edges: Array<{
			node: {
				id: string;
				title: string;
				quantity: number;
				currentQuantity: number;
				variant: {
					title: string | null;
					image: { url: string; altText: string | null } | null;
				} | null;
			};
		}>;
	};
	successfulFulfillments?: Array<{
		trackingCompany: string | null;
		trackingInfo: Array<{ number: string | null; url: string | null }>;
		fulfillmentLineItems: {
			edges: Array<{
				node: {
					quantity: number;
					lineItem: { id: string; title: string };
				};
			}>;
		};
	}> | null;
}): TrackResult {
	const fulfillments = order.successfulFulfillments ?? [];
	const fulfilledByLine = aggregateFulfilledQtyByLineItemId(fulfillments);

	const lineItems: TrackLineItem[] = (order.lineItems?.edges ?? []).map(
		({ node: li }) => ({
			id: li.id,
			title: li.title,
			quantity: li.quantity,
			currentQuantity: li.currentQuantity,
			imageUrl: li.variant?.image?.url ?? null,
			imageAlt: li.variant?.image?.altText ?? null,
			variantTitle: li.variant?.title ?? null,
			fulfilledQty: fulfilledByLine[li.id] ?? 0,
		}),
	);

	const fulfillmentsUi: TrackFulfillment[] = fulfillments.map((ff) => ({
		trackingCompany: ff.trackingCompany ?? null,
		tracking: (ff.trackingInfo ?? []).map((t) => ({
			number: t.number ?? null,
			url: t.url ?? null,
		})),
		lines:
			ff.fulfillmentLineItems?.edges?.map((e) => ({
				title: e.node.lineItem.title,
				quantity: e.node.quantity,
			})) ?? [],
	}));

	return {
		kind: "found",
		orderNumber: order.orderNumber,
		fulfillmentStatus: order.fulfillmentStatus || "UNFULFILLED",
		financialStatus: order.financialStatus ?? null,
		canceledAt: order.canceledAt ?? null,
		cancelReason: order.cancelReason ?? null,
		processedAt: order.processedAt,
		statusUrl: order.statusUrl,
		totalPrice: order.totalPrice,
		lineItems,
		fulfillments: fulfillmentsUi,
	};
}

const TrackOrder = () => {
	const [orderNumber, setOrderNumber] = useState("");
	const [searched, setSearched] = useState(false);
	const [result, setResult] = useState<TrackResult>(null);

	const { accessToken } = useAuthStore();
	const { data: customer, isLoading: customerLoading } = useQuery({
		queryKey: ["customer", accessToken],
		queryFn: () => getCustomerData(accessToken!),
		enabled: !!accessToken,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		refetchInterval: accessToken ? 60_000 : false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const cleanSearch = orderNumber.replace(/[^0-9]/g, "");
		setSearched(true);
		setResult(null);

		if (!cleanSearch) {
			setResult({ kind: "not_found" });
			return;
		}
		if (!accessToken) {
			setResult({ kind: "need_login" });
			return;
		}
	};

	useEffect(() => {
		if (!searched || !accessToken) return;
		const cleanSearch = orderNumber.replace(/[^0-9]/g, "");
		if (!cleanSearch) return;
		if (customerLoading) return;

		const edges = customer?.orders?.edges ?? [];
		const found = edges.find(
			(edge: { node: { orderNumber: number } }) =>
				edge.node.orderNumber.toString() === cleanSearch,
		)?.node;

		if (found) {
			setResult(mapCustomerOrderToResult(found));
		} else {
			setResult({ kind: "not_found" });
		}
	}, [searched, accessToken, customerLoading, customer, orderNumber]);

	const isCanceled =
		result?.kind === "found" && !!result.canceledAt;
	const activeStep =
		result?.kind === "found" && !isCanceled
			? getTrackingStepByFulfillment(result.fulfillmentStatus)
			: -1;

	const lookupBlocked = !!accessToken && customerLoading && searched;

	const orderSummary =
		result?.kind === "found"
			? getOrderStatusView(
					result.fulfillmentStatus,
					result.financialStatus,
					result.canceledAt,
				)
			: null;

	return (
		<div className="min-h-screen bg-background pt-[140px] pb-32">
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<div className="max-w-4xl mx-auto text-center mb-24">
					<h1 className="font-display tracking-[-0.03em] text-6xl lg:text-[7rem] font-medium leading-[0.95] mb-8">
						Track Your <br className="hidden lg:block" /> Order
					</h1>
					<p className="text-[17px] lg:text-[19px] text-muted-foreground/80 font-light leading-relaxed max-w-2xl mx-auto">
						Enter your order number to see payment and fulfillment status, items,
						and tracking for orders placed while signed in. Guest checkout orders
						can use the link in your confirmation email or Shopify order status
						page.
					</p>
				</div>

				<div className="max-w-2xl mx-auto">
					<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-16">
						<Input
							placeholder="Order Number (e.g. 1001)"
							value={orderNumber}
							onChange={(e) => {
								setOrderNumber(e.target.value);
								setSearched(false);
								setResult(null);
							}}
							required
							className="bg-secondary/30 flex-1 h-[54px] rounded-2xl px-6 text-[15px] border-border/50 focus-visible:ring-foreground"
							maxLength={50}
						/>
						<Button
							type="submit"
							disabled={lookupBlocked}
							className="h-[54px] px-10 text-[15px] rounded-2xl bg-foreground text-background shadow-md transition-transform active:scale-[0.98]"
						>
							{lookupBlocked ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								<>
									<Search className="h-4 w-4 mr-2" /> Track order
								</>
							)}
						</Button>
					</form>

					<div className="transition-all duration-300 ease-out">
						{searched && (
							<div className="rounded-[2.5rem] bg-secondary/30 border border-border/40 p-10 lg:p-14 shadow-sm">
								{lookupBlocked ? (
									<div className="flex flex-col items-center justify-center py-10">
										<Loader2 className="h-8 w-8 animate-spin text-foreground mb-6" />
										<p className="text-center text-[16px] text-muted-foreground/70 font-light">
											Loading your orders…
										</p>
									</div>
								) : result?.kind === "need_login" ? (
									<div className="flex flex-col items-center justify-center py-10 text-center max-w-md mx-auto">
										<div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
											<Package className="h-8 w-8 text-muted-foreground" />
										</div>
										<h3 className="font-display tracking-tight text-2xl font-medium mb-3">
											Sign in to track
										</h3>
										<p className="text-[15px] text-muted-foreground/80 font-light leading-relaxed mb-6">
											Order lookup for your account is available after you sign in.
											For guest orders, open the order confirmation email and use
											Shopify&apos;s order status link.
										</p>
										<Button asChild variant="outline" className="rounded-full">
											<Link href="/">Back to home</Link>
										</Button>
									</div>
								) : result?.kind === "found" ? (
									<>
										<div className="text-center mb-10">
											<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-[13px] font-medium tracking-wide mb-4">
												<span
													className={`w-2 h-2 rounded-full ${isCanceled ? "bg-destructive" : "bg-green-500"}`}
												/>
												Order #{result.orderNumber}
											</div>
											{orderSummary && (
												<div className="flex flex-wrap items-center justify-center gap-2 mb-4">
													<span
														className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${orderSummary.className}`}
													>
														{orderSummary.label}
													</span>
												</div>
											)}
											<p className="text-[15px] text-muted-foreground/70 font-light mb-6">
												Live status from your account (refreshes periodically while
												you&apos;re signed in).
											</p>
										</div>

										{/* Full status breakdown */}
										<div className="rounded-2xl border border-border/50 bg-background/80 p-5 sm:p-6 mb-10 text-left space-y-4">
											<h3 className="font-display text-lg font-medium tracking-tight">
												Order status
											</h3>
											<dl className="grid gap-3 text-[15px] sm:grid-cols-2">
												<div>
													<dt className="text-muted-foreground/80 text-xs uppercase tracking-wider mb-1">
														Payment
													</dt>
													<dd className="font-medium">
														{humanizeFinancialStatus(result.financialStatus)}
													</dd>
												</div>
												<div>
													<dt className="text-muted-foreground/80 text-xs uppercase tracking-wider mb-1">
														Fulfillment
													</dt>
													<dd className="font-medium">
														{humanizeFulfillmentStatus(result.fulfillmentStatus)}
													</dd>
												</div>
												{isCanceled && (
													<div className="sm:col-span-2">
														<dt className="text-muted-foreground/80 text-xs uppercase tracking-wider mb-1">
															Cancellation
														</dt>
														<dd className="font-medium text-destructive">
															{humanizeCancelReason(result.cancelReason) ??
																"Order was canceled"}
														</dd>
													</div>
												)}
												<div>
													<dt className="text-muted-foreground/80 text-xs uppercase tracking-wider mb-1">
														Placed
													</dt>
													<dd className="font-medium">
														{new Date(result.processedAt).toLocaleString(undefined, {
															dateStyle: "medium",
															timeStyle: "short",
														})}
													</dd>
												</div>
												<div>
													<dt className="text-muted-foreground/80 text-xs uppercase tracking-wider mb-1">
														Total
													</dt>
													<dd className="font-medium">
														{Number.parseFloat(result.totalPrice.amount).toLocaleString(
															undefined,
															{
																style: "currency",
																currency: result.totalPrice.currencyCode,
															},
														)}
													</dd>
												</div>
											</dl>
											<div className="pt-2">
												<a
													href={result.statusUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 text-[15px] font-medium text-foreground underline-offset-4 hover:underline"
												>
													Open full order status page
													<ExternalLink className="h-4 w-4 shrink-0 opacity-70" />
												</a>
												<p className="text-[13px] text-muted-foreground/70 mt-2 leading-relaxed">
													Shopify&apos;s status page may include carrier tracking
													and updates not shown here.
												</p>
											</div>
										</div>

										{/* Line items + per-item status */}
										{result.lineItems.length > 0 && (
											<div className="mb-10">
												<h3 className="font-display text-lg font-medium tracking-tight mb-4 text-center sm:text-left">
													Items in this order
												</h3>
												<ul className="space-y-3">
													{result.lineItems.map((li) => {
														const ship = getLineItemShipStatus(
															result.canceledAt,
															li.currentQuantity,
															li.fulfilledQty,
														);
														const shipLabel = labelForLineItemShipStatus(ship);
														return (
															<li
																key={li.id}
																className="flex gap-4 rounded-2xl border border-border/40 bg-background/60 p-4"
															>
																<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
																	{li.imageUrl ? (
																		<Image
																			src={li.imageUrl}
																			alt={li.imageAlt || li.title}
																			fill
																			className="object-cover"
																			sizes="64px"
																		/>
																	) : (
																		<div className="flex h-full w-full items-center justify-center">
																			<Package className="h-6 w-6 text-muted-foreground" />
																		</div>
																	)}
																</div>
																<div className="min-w-0 flex-1">
																	<p className="font-medium leading-snug">{li.title}</p>
																	{li.variantTitle && (
																		<p className="text-[13px] text-muted-foreground mt-0.5">
																			{li.variantTitle}
																		</p>
																	)}
																	<p className="text-[13px] text-muted-foreground mt-1">
																		Qty {li.currentQuantity}
																		{li.fulfilledQty > 0 &&
																			li.fulfilledQty < li.currentQuantity && (
																				<span>
																					{" "}
																					· {li.fulfilledQty} shipped so far
																				</span>
																			)}
																	</p>
																</div>
																<span className="shrink-0 self-start rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
																	{shipLabel}
																</span>
															</li>
														);
													})}
												</ul>
											</div>
										)}

										{/* Shipments & tracking */}
										{result.fulfillments.length > 0 && (
											<div className="mb-10 rounded-2xl border border-border/50 bg-background/80 p-5 sm:p-6 text-left">
												<h3 className="font-display text-lg font-medium tracking-tight mb-4">
													Shipments & tracking
												</h3>
												<ul className="space-y-6">
													{result.fulfillments.map((f, idx) => (
														<li key={idx} className="border-b border-border/30 pb-6 last:border-0 last:pb-0">
															{f.trackingCompany && (
																<p className="text-sm font-medium mb-2">
																	Carrier: {f.trackingCompany}
																</p>
															)}
															{f.tracking.length > 0 ? (
																<ul className="space-y-2 mb-3">
																	{f.tracking.map((t, ti) => (
																		<li key={ti} className="text-[15px]">
																			{t.number && (
																				<span className="font-mono">{t.number}</span>
																			)}
																			{t.url && (
																				<>
																					{" "}
																					<a
																						href={t.url}
																						target="_blank"
																						rel="noopener noreferrer"
																						className="text-foreground underline-offset-4 hover:underline inline-flex items-center gap-1"
																					>
																						Track package
																						<ExternalLink className="h-3.5 w-3.5" />
																					</a>
																				</>
																			)}
																		</li>
																	))}
																</ul>
															) : (
																<p className="text-[14px] text-muted-foreground mb-2">
																	Tracking numbers may appear after the label is
																	created.
																</p>
															)}
															{f.lines.length > 0 && (
																<ul className="text-[14px] text-muted-foreground space-y-1">
																	{f.lines.map((l, li) => (
																		<li key={li}>
																			{l.quantity}× {l.title}
																		</li>
																	))}
																</ul>
															)}
														</li>
													))}
												</ul>
											</div>
										)}

										{!isCanceled && (
											<div className="space-y-0 max-w-sm mx-auto relative">
												{steps.map((step, i) => {
													const isActive = activeStep >= 0 && i <= activeStep;
													return (
														<div key={step.label} className="flex gap-6">
															<div className="flex flex-col items-center relative">
																<div
																	className={`w-[54px] h-[54px] rounded-full flex items-center justify-center shadow-sm border transition-colors duration-300 ${isActive ? "bg-foreground border-foreground text-background z-10" : "bg-background border-border/60 text-muted-foreground"}`}
																>
																	<step.icon
																		className={`h-[22px] w-[22px] ${isActive ? "opacity-100" : "opacity-50"}`}
																	/>
																</div>
																{i < steps.length - 1 && (
																	<div
																		className={`w-[2px] h-16 my-2 rounded-full transition-colors duration-300 ${i < activeStep ? "bg-foreground" : "bg-border/40"}`}
																	/>
																)}
															</div>
															<div
																className={`pb-8 pt-3 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-40"}`}
															>
																<h4 className="font-display text-[19px] font-medium tracking-tight mb-1.5">
																	{step.label}
																</h4>
																<p className="text-[15px] text-muted-foreground/80 font-light leading-relaxed">
																	{step.desc}
																</p>
															</div>
														</div>
													);
												})}
											</div>
										)}
										{isCanceled && (
											<div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center max-w-md mx-auto">
												<p className="font-medium text-destructive mb-1">
													This order was canceled
												</p>
												<p className="text-[14px] text-muted-foreground leading-relaxed">
													The timeline above is hidden. Use the full order status
													link for refund or return details from Shopify.
												</p>
											</div>
										)}
									</>
								) : (
									<div className="flex flex-col items-center justify-center py-10 text-center">
										<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
											<AlertCircle className="h-8 w-8 text-destructive" />
										</div>
										<h3 className="font-display tracking-tight text-2xl font-medium mb-3">
											Order not found
										</h3>
										<p className="text-[15px] text-muted-foreground/80 font-light max-w-sm leading-relaxed">
											We couldn&apos;t find that order on your account. Check the
											number, or use the link in your confirmation email if you
											checkout as a guest.
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TrackOrder;
