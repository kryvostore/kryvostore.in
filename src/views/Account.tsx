"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { getCustomerData } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Package,
	User,
	MapPin,
	Loader2,
	LogOut,
	ExternalLink,
	Pencil,
} from "lucide-react";
import { EditProfileDialog } from "@/components/EditProfileDialog";

/** Matches Storefront `customer { orders { edges { node { ... } } } }` */
type CustomerOrderEdge = {
	node: {
		id: string;
		orderNumber: number;
		processedAt: string;
		fulfillmentStatus: string | null;
		financialStatus: string | null;
		/** Shopify-hosted order status page; opens in a new tab from account. */
		statusUrl: string;
		totalPrice: { amount: string; currencyCode: string };
	};
};

const Account = () => {
	const { accessToken, logout } = useAuthStore();
	const router = useRouter();
	const [editProfileOpen, setEditProfileOpen] = useState(false);

	const { data: customer, isLoading, isError } = useQuery({
		queryKey: ["customer", accessToken],
		queryFn: () => getCustomerData(accessToken!),
		enabled: !!accessToken,
	});

	useEffect(() => {
		if (!accessToken) {
			router.replace("/");
		}
	}, [accessToken, router]);

	useEffect(() => {
		if (!accessToken || isLoading) return;
		if (isError || customer == null) {
			logout();
		}
	}, [accessToken, isLoading, isError, customer, logout]);

	const handleLogout = () => {
		logout();
		router.replace("/");
	};

	if (!accessToken) {
		return (
			<div className="min-h-screen bg-background pt-40 pb-32 flex items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-foreground" />
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background pt-40 pb-32 flex items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-foreground" />
			</div>
		);
	}

	if (!customer) return null;

	return (
		<div className="min-h-screen bg-background pt-32 pb-32">
			<EditProfileDialog
				open={editProfileOpen}
				onOpenChange={setEditProfileOpen}
				profile={{
					firstName: customer.firstName,
					lastName: customer.lastName,
					email: customer.email,
					phone: customer.phone,
				}}
			/>
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				{/* Header Setup */}
				<div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6 border-b border-border/40 pb-8">
					<div>
						<h1 className="font-display tracking-[-0.03em] text-4xl lg:text-5xl font-normal mb-3">
							My Account
						</h1>
						<p className="text-muted-foreground/80 font-light text-[15px]">
							Manage your orders, profile details, and preferences.
						</p>
					</div>
					<Button
						onClick={handleLogout}
						variant="outline"
						className="rounded-full h-12 px-6 bg-secondary/30 border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
					>
						<LogOut className="w-4 h-4 mr-2" /> Log Out
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* LEFT COL: Profile & Address */}
					<div className="lg:col-span-4 space-y-8">
						{/* Profile Card */}
						<div className="bg-secondary/30 rounded-[2rem] p-8 border border-border/40">
							<div className="flex items-start justify-between gap-4 mb-6">
								<div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center shadow-sm shrink-0">
									<User className="w-5 h-5 text-background" />
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="rounded-full h-9 px-4 text-[13px] border-border/60 bg-background/80 hover:bg-background"
									onClick={() => setEditProfileOpen(true)}
								>
									<Pencil className="h-3.5 w-3.5 mr-2" />
									Edit profile
								</Button>
							</div>
							<h3 className="font-display text-xl font-normal mb-1">
								Profile Details
							</h3>
							<div className="space-y-4 mt-6">
								<div>
									<p className="text-xs text-muted-foreground uppercase font-semibold mb-1 tracking-wider">
										Name
									</p>
									<p className="text-[15px] font-medium">
										{customer.firstName} {customer.lastName}
									</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground uppercase font-semibold mb-1 tracking-wider">
										Email
									</p>
									<p className="text-[15px] font-medium">{customer.email}</p>
								</div>
								{customer.phone && (
									<div>
										<p className="text-xs text-muted-foreground uppercase font-semibold mb-1 tracking-wider">
											Phone
										</p>
										<p className="text-[15px] font-medium">{customer.phone}</p>
									</div>
								)}
							</div>
						</div>

						{/* Address Card */}
						<div className="bg-secondary/30 rounded-[2rem] p-8 border border-border/40">
							<div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center mb-6 shadow-sm">
								<MapPin className="w-5 h-5 text-background" />
							</div>
							<h3 className="font-display text-xl font-normal mb-1">
								Default Address
							</h3>

							{customer.defaultAddress ? (
								<div className="space-y-1 mt-6 text-[15px] text-muted-foreground">
									<p className="text-foreground font-medium">
										{customer.firstName} {customer.lastName}
									</p>
									<p>{customer.defaultAddress.address1}</p>
									{customer.defaultAddress.address2 && (
										<p>{customer.defaultAddress.address2}</p>
									)}
									<p>
										{customer.defaultAddress.city},{" "}
										{customer.defaultAddress.province}{" "}
										{customer.defaultAddress.zip}
									</p>
									<p>{customer.defaultAddress.country}</p>
								</div>
							) : (
								<p className="text-[15px] text-muted-foreground mt-4">
									No default address saved yet. You can add one during checkout.
								</p>
							)}
						</div>
					</div>

					{/* RIGHT COL: Order History */}
					<div className="lg:col-span-8">
						<div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
							<h2 className="font-display text-2xl font-normal flex items-center gap-3 tracking-tight">
								<Package className="w-6 h-6 text-foreground/70" /> Order History
							</h2>
							<Link
								href="/track-order"
								className="text-[14px] text-muted-foreground hover:text-foreground underline-offset-4 hover:underline shrink-0"
							>
								Track a guest order
							</Link>
						</div>

						{!customer.orders?.edges || customer.orders.edges.length === 0 ? (
							<div className="bg-secondary/30 rounded-[2.5rem] p-16 text-center border border-border/40 flex flex-col items-center">
								<div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
									<Package className="h-8 w-8 text-muted-foreground/60" />
								</div>
								<h3 className="font-display text-xl font-medium mb-2">
									No Orders Yet
								</h3>
								<p className="text-muted-foreground/80 mb-8 max-w-[300px] text-[15px]">
									When you make a purchase, your complete order history and
									tracking links will appear here.
								</p>
								<Button
									onClick={() => router.push("/collections")}
									className="rounded-full h-[50px] px-8 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
								>
									Start Shopping
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								{customer.orders.edges.map((edge: CustomerOrderEdge) => {
									const order = edge.node;
									const date = new Date(order.processedAt).toLocaleDateString(
										"en-US",
										{ year: "numeric", month: "long", day: "numeric" },
									);

									const statusHref = order.statusUrl?.trim();
									return (
										<a
											key={order.id}
											href={statusHref || "/track-order"}
											target={statusHref ? "_blank" : undefined}
											rel={statusHref ? "noopener noreferrer" : undefined}
											aria-label={`View order ${order.orderNumber} details${statusHref ? " (opens in a new tab)" : ""}`}
											className="bg-secondary/20 rounded-[1.5rem] p-6 lg:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-6 border border-border/40 hover:border-foreground/20 transition-colors group cursor-pointer"
										>
											<div>
												<div className="flex items-center gap-3 mb-2">
													<h4 className="font-display text-[18px] font-medium tracking-tight">
														Order #{order.orderNumber}
													</h4>
													<span
														className={`text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${
															order.fulfillmentStatus === "FULFILLED"
																? "bg-green-100 text-green-700"
																: order.fulfillmentStatus === "UNFULFILLED"
																	? "bg-secondary text-muted-foreground"
																	: "bg-yellow-100 text-yellow-700"
														}`}
													>
														{order.fulfillmentStatus || "Processing"}
													</span>
												</div>
												<p className="text-[14px] text-muted-foreground font-light">
													{date}
												</p>
											</div>

											<div className="flex items-center gap-6 sm:text-right">
												<div>
													<p className="text-[12px] text-muted-foreground uppercase font-semibold mb-1 tracking-wider">
														Total
													</p>
													<p className="text-[16px] font-semibold">
														{order.totalPrice.currencyCode}{" "}
														{parseFloat(order.totalPrice.amount).toFixed(2)}
													</p>
												</div>

												<span
													className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border/60 bg-background group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-[160ms]"
													aria-hidden
												>
													<ExternalLink className="w-5 h-5" />
												</span>
											</div>
										</a>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Account;


