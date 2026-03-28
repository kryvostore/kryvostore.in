const Privacy = () => {
	return (
		<div className="pt-32 pb-24 bg-background min-h-screen">
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-8">
					Privacy Policy
				</h1>
				<p className="text-muted-foreground mb-12">
					Effective Date: {new Date().toLocaleDateString()}
				</p>

				<div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground/90 leading-relaxed">
					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							1. Introduction
						</h2>
						<p>
							Welcome to KRYVO ("we," "our," or "us"). We are committed to
							protecting your personal information and your right to privacy. If
							you have any questions or concerns about this privacy notice or
							our practices with regard to your personal information, please
							contact us at kryvostore.in@gmail.com.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							2. Information We Collect
						</h2>
						<p>
							We collect personal information that you voluntarily provide to us
							when you register on the website, express an interest in obtaining
							information about us or our products, when you participate in
							activities on the website, or otherwise when you contact us. This
							may include:
						</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>Names, Phone Numbers, and Email Addresses</li>
							<li>Billing and Shipping Addresses</li>
							<li>
								Payment Information (processed securely through our payment
								providers)
							</li>
							<li>Order History and Wishlist Data</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							3. How We Use Your Information
						</h2>
						<p>
							We use personal information collected via our website for a
							variety of business purposes described below. We process your
							personal information for these purposes in reliance on our
							legitimate business interests, in order to enter into or perform a
							contract with you, with your consent, and/or for compliance with
							our legal obligations:
						</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>To fulfill and manage your orders.</li>
							<li>To send administrative and tracking information to you.</li>
							<li>
								To send you marketing and promotional communications (if
								opted-in).
							</li>
							<li>
								To enforce our terms, conditions, and policies for business
								purposes, legal reasons, and contractual.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							4. Sharing Your Information
						</h2>
						<p>
							We do not share, sell, rent, or trade your personal information
							with third parties for their promotional purposes. We only share
							information with our trusted partners (like shipping carriers and
							payment processors) strictly to fulfill our services to you.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							5. Cookies and Tracking
						</h2>
						<p>
							We may use cookies and similar tracking technologies to access or
							store information. Specific information about how we use such
							technologies and how you can refuse certain cookies is set out in
							our Cookie Notice.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">
							6. Contact Us
						</h2>
						<p>
							If you have questions or comments about this notice, you may email
							us at:
							<br />
							<a
								href="mailto:kryvostore.in@gmail.com"
								className="text-primary hover:underline font-medium"
							>
								kryvostore.in@gmail.com
							</a>
							<br />
							<br />
							Or by post to:
							<br />
							Kuttikkatoor, Kozhikode, Kerala
						</p>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Privacy;


