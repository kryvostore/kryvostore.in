const LAST_UPDATED = "March 29, 2026";

const RefundPolicy = () => {
	return (
		<div className="pt-32 pb-24 bg-background min-h-screen">
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-4">
					Return and refund policy
				</h1>
				<p className="text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

				<div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-muted-foreground/90 leading-relaxed">
					<section>
						<p>
							We want you to be satisfied with your purchase from kryvostore. This
							policy explains how returns and refunds work for orders placed
							through kryvo.store and completed via our Shopify checkout. Our
							store is powered by Shopify; fulfillment, return windows, and refund
							timing may also reflect settings in our Shopify admin and the
							information in your order confirmation.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Eligibility
						</h2>
						<p>
							Return eligibility depends on the product type, condition, and time
							since delivery. Many items may be returned within{" "}
							<strong className="text-foreground">45 days of purchase</strong>{" "}
							where stated on the product page or in your order materials,
							subject to the item being unused, in original packaging where
							applicable, and meeting any hygiene or sealed-product rules for
							certain categories.
						</p>
						<p className="mt-4">
							Some items may be marked as final sale or non-returnable at the time
							of purchase; those terms apply if disclosed before you complete
							checkout.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							How to start a return
						</h2>
						<p>
							Please refer to your order confirmation email for return
							instructions, or{" "}
							<a href="/contact" className="text-primary hover:underline font-medium">
								contact our support team
							</a>{" "}
							with your order number. We will provide return steps, including
							whether a prepaid label is available or other carrier options.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Refunds
						</h2>
						<p>
							Once we receive and inspect your return, we will notify you of
							approval or rejection. Approved refunds are processed to your
							original method of payment unless otherwise required by law or
							agreed with you. Refund timing can depend on your bank or card
							issuer.
						</p>
						<p className="mt-4">
							Original shipping charges, if any were shown separately on a
							particular order, may be handled according to applicable law and
							our Shopify store settings. Taxes (e.g. GST, where applicable)
							follow applicable law and what appears on your order or invoice.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Exchanges
						</h2>
						<p>
							Where exchanges are offered, availability of replacement items is
							subject to stock. If an exchange is not possible, a refund may be
							issued instead.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Damaged or wrong items
						</h2>
						<p>
							If you receive a damaged, defective, or incorrect item, please
							contact us promptly with photos and your order details so we can
							help.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Contact
						</h2>
						<p>
							Questions about this policy:{" "}
							<a
								href="mailto:kryvostore.in@gmail.com"
								className="text-primary hover:underline font-medium"
							>
								kryvostore.in@gmail.com
							</a>{" "}
							or see{" "}
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

export default RefundPolicy;
