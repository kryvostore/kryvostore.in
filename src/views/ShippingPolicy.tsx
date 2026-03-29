const LAST_UPDATED = "March 29, 2026";

const ShippingPolicy = () => {
	return (
		<div className="pt-32 pb-24 bg-background min-h-screen">
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-4">
					Shipping Policy
				</h1>
				<p className="text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

				<div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground/90 leading-relaxed">
					<section>
						<p>
							This Shipping Policy describes how kryvostore (&quot;we,&quot;
							&quot;us&quot;) ships orders placed through kryvo.store and our
							Shopify-powered checkout. By placing an order, you agree to this
							policy together with our{" "}
							<a href="/terms" className="text-primary hover:underline font-medium">
								Terms &amp; Conditions
							</a>
							.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Shipping fees
						</h2>
						<p>
							<strong className="text-foreground">Standard shipping is free</strong>{" "}
							on all orders. We do not add a separate shipping line for standard
							delivery at checkout; your order total reflects the items you
							purchase. We may update this policy from time to time; the version
							on this page applies to orders placed after the &quot;Last
							updated&quot; date above.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Where we ship (India only)
						</h2>
						<p>
							We currently ship{" "}
							<strong className="text-foreground">within India only</strong> —
							to addresses we can service as shown at checkout. We do not ship
							orders outside India at this time.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Processing and delivery times
						</h2>
						<p>
							Orders are typically processed within the timelines shown at
							checkout and in your order confirmation.{" "}
							<strong className="text-foreground">
								Estimated delivery is often in the range of 5–10 business days
							</strong>{" "}
							depending on your pin code, product availability, and carrier
							schedules. These are estimates only; holidays, weather, or carrier
							delays may extend delivery times.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Multiple packages and suppliers
						</h2>
						<p>
							Your cart may include items fulfilled from different locations or
							suppliers.{" "}
							<strong className="text-foreground">
								Items may arrive in separate packages
							</strong>{" "}
							and on different days. Shipping remains free as described above; we
							do not split or add per-package shipping fees on our storefront for
							standard delivery.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Order tracking
						</h2>
						<p>
							When your order ships, tracking information is typically provided by
							email and may also be available through your account or our{" "}
							<a
								href="/track-order"
								className="text-primary hover:underline font-medium"
							>
								Track order
							</a>{" "}
							page where applicable.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Incorrect addresses and failed delivery
						</h2>
						<p>
							You are responsible for providing a complete and accurate shipping
							address. If a shipment is returned due to an incorrect or incomplete
							address, we may contact you to arrange reshipment; additional
							carrier costs may apply in those cases.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Questions
						</h2>
						<p>
							For help with shipping, visit our{" "}
							<a href="/contact" className="text-primary hover:underline font-medium">
								Contact &amp; FAQ
							</a>{" "}
							page or see{" "}
							<a
								href="/contact-information"
								className="text-primary hover:underline font-medium"
							>
								Contact information
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default ShippingPolicy;
