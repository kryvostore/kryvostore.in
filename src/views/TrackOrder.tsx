"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getCustomerData } from "@/lib/shopify";

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

type TrackResult =
	| null
	| { kind: "not_found" }
	| { kind: "need_login" }
	| { kind: "found"; fulfillmentStatus: string; orderNumber: number };

const TrackOrder = () => {
	const [orderNumber, setOrderNumber] = useState("");
	const [searched, setSearched] = useState(false);
	const [result, setResult] = useState<TrackResult>(null);

	const { accessToken } = useAuthStore();
	const { data: customer, isLoading: customerLoading } = useQuery({
		queryKey: ["customer", accessToken],
		queryFn: () => getCustomerData(accessToken!),
		enabled: !!accessToken,
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
		// Logged in: lookup runs in useEffect when `customer` / orders are ready
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
			setResult({
				kind: "found",
				fulfillmentStatus: found.fulfillmentStatus || "UNFULFILLED",
				orderNumber: found.orderNumber,
			});
		} else {
			setResult({ kind: "not_found" });
		}
	}, [searched, accessToken, customerLoading, customer, orderNumber]);

	const getCurrentStepIndex = (status: string) => {
		switch (status) {
			case "FULFILLED":
				return 3;
			case "PARTIALLY_FULFILLED":
				return 2;
			case "UNFULFILLED":
			default:
				return 1;
		}
	};

	const activeStep =
		result?.kind === "found"
			? getCurrentStepIndex(result.fulfillmentStatus)
			: 0;

	const lookupBlocked = !!accessToken && customerLoading && searched;

	return (
		<div className="min-h-screen bg-background pt-[140px] pb-32">
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<div className="max-w-4xl mx-auto text-center mb-24">
					<h1 className="font-display tracking-[-0.03em] text-6xl lg:text-[7rem] font-medium leading-[0.95] mb-8">
						Track Your <br className="hidden lg:block" /> Order
					</h1>
					<p className="text-[17px] lg:text-[19px] text-muted-foreground/80 font-light leading-relaxed max-w-2xl mx-auto">
						Enter your order number to see fulfillment status for orders placed
						while signed in. Guest checkout orders use the tracking link in your
						confirmation email.
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
										<div className="text-center mb-12">
											<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-[13px] font-medium tracking-wide mb-4">
												<span className="w-2 h-2 rounded-full bg-green-500" />
												Order #{result.orderNumber}
											</div>
											<p className="text-[15px] text-muted-foreground/70 font-light">
												Fulfillment status from your account.
											</p>
										</div>

										<div className="space-y-0 max-w-sm mx-auto relative">
											{steps.map((step, i) => {
												const isActive = i <= activeStep;
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
