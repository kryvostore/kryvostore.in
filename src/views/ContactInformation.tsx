const LAST_UPDATED = "March 29, 2026";

/** Legal contact details (mirrors Shopify “Contact information” policy). */
const ContactInformation = () => {
	return (
		<div className="pt-32 pb-24 bg-background min-h-screen">
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-4">
					Contact information
				</h1>
				<p className="text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

				<div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground/90 leading-relaxed">
					<p>
						For questions about orders, products, returns, privacy, or these
						policies, you may reach kryvostore using the details below. You can
						also use our{" "}
						<a href="/contact" className="text-primary hover:underline font-medium">
							contact form and FAQ
						</a>
						.
					</p>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Email
						</h2>
						<p>
							<a
								href="mailto:kryvostore.in@gmail.com"
								className="text-primary hover:underline font-medium"
							>
								kryvostore.in@gmail.com
							</a>
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Phone
						</h2>
						<ul className="list-none space-y-2 pl-0">
							<li>
								<a
									href="tel:+919061061442"
									className="text-primary hover:underline font-medium"
								>
									+91 90610 61442
								</a>
							</li>
							<li>
								<a
									href="tel:+919605655712"
									className="text-primary hover:underline font-medium"
								>
									+91 96056 55712
								</a>
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							Registered address
						</h2>
						<p className="text-foreground/95">
							Thwaiba House, Velliparamba PO, Kaniyath, Kuttikkattoor, KL, 673008,
							IN
						</p>
						<p className="mt-4 text-sm">
							General location: Kuttikkatoor, Kozhikode, Kerala (for reference on
							maps and correspondence).
						</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default ContactInformation;
