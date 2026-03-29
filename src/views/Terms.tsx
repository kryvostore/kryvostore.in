const LAST_UPDATED = "March 29, 2026";

const Terms = () => {
	return (
		<div className="pt-32 pb-24 bg-background min-h-screen">
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-4">
					Terms of Service
				</h1>
				<p className="text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

				<div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground/90 leading-relaxed">
					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							1. Agreement to Terms
						</h2>
						<p>
							These Terms and Conditions constitute a legally binding agreement
							made between you, whether personally or on behalf of an entity
							("you") and KRYVO ("we," "us," or "our"), concerning your access
							to and use of our website as well as any other media form, media
							channel, mobile website, or mobile application related, linked, or
							otherwise connected thereto.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							2. Intellectual Property Rights
						</h2>
						<p>
							Unless otherwise indicated, the Site is our proprietary property
							and all source code, databases, functionality, software, website
							designs, audio, video, text, photographs, and graphics on the Site
							(collectively, the "Content") and the trademarks, service marks,
							and logos contained therein (the "Marks") are owned or controlled
							by us or licensed to us.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							3. User Representations
						</h2>
						<p>
							By using the Site, you represent and warrant that: (1) all
							registration information you submit will be true, accurate,
							current, and complete; (2) you will maintain the accuracy of such
							information and promptly update such registration information as
							necessary; (3) you have the legal capacity and you agree to comply
							with these Terms and Conditions.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							4. Products and Pricing
						</h2>
						<p>
							We make every effort to display as accurately as possible the
							colors, features, specifications, and details of the products
							available on the Site. However, we do not guarantee that the
							colors, features, specifications, and details of the products will
							be accurate, complete, reliable, current, or free of other errors,
							and your electronic display may not accurately reflect the actual
							colors and details of the products.
						</p>
						<p className="mt-4">
							All prices are subject to change. We reserve the right to modify
							or discontinue any product at any time without notice.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							5. Delivery and Returns
						</h2>
						<p>
							For delivery and shipping, see our{" "}
							<a href="/shipping" className="text-primary hover:underline font-medium">
								Shipping Policy
							</a>
							. For returns and refunds, see our{" "}
							<a href="/refund" className="text-primary hover:underline font-medium">
								Return and refund policy
							</a>
							. We reserve the right to refuse any order placed through the Site.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							6. Contact Information
						</h2>
						<p>
							In order to resolve a complaint regarding the Site or to receive
							further information regarding use of the Site, please contact us
							using the details on our{" "}
							<a
								href="/contact-information"
								className="text-primary hover:underline font-medium"
							>
								Contact information
							</a>{" "}
							page or the{" "}
							<a href="/contact" className="text-primary hover:underline font-medium">
								Contact &amp; FAQ
							</a>{" "}
							page.
						</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Terms;


