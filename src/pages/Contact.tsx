import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { SEO } from "@/components/SEO";

const faqs = [
	{
		q: "How long does shipping take?",
		a: "Standard shipping takes 5–10 business days. Express shipping is available at checkout for faster delivery.",
	},
	{
		q: "Do you offer free shipping?",
		a: "Yes! We offer free shipping on all orders over $50. International shipping rates vary by location.",
	},
	{
		q: "What is your return policy?",
		a: "We offer a 30-day hassle-free return policy. If you're not satisfied, simply contact us for a return label.",
	},
	{
		q: "How do I track my order?",
		a: "Once your order ships, you'll receive a tracking number via email. You can also use our Track Order page.",
	},
	{
		q: "Are your products covered by warranty?",
		a: "Yes, all products come with a minimum 1-year manufacturer warranty. Some products include extended warranty options.",
	},
	{
		q: "Can I cancel or modify my order?",
		a: "Orders can be modified or cancelled within 2 hours of placement. Contact our support team immediately for assistance.",
	},
	{
		q: "Do you ship internationally?",
		a: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination.",
	},
];

const Contact = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setTimeout(() => {
			toast.success("Message sent!", {
				description: "We'll get back to you within 24 hours.",
			});
			setIsSubmitting(false);
			(e.target as HTMLFormElement).reset();
		}, 1000);
	};

	return (
		<div className="min-h-screen bg-background pt-48 pb-32">
			<SEO
				title="Contact Us"
				description="Get in touch with the KRYVO team. We're here to help with orders, returns, product questions, and anything else. Reach us via email or WhatsApp."
				url="https://kryvo.store/contact"
			/>
			<div className="container mx-auto px-6 lg:px-8 max-w-6xl">
				{/* Massive Hero Typography */}
				<div className="text-center mb-24">
					<h1 className="font-display tracking-[[-0.03em]] text-6xl font-normal leading-[0.95] mb-8">
						Get in Touch
					</h1>
					<p className="text-[17px] lg:text-[19px] text-muted-foreground/80 font-light leading-relaxed max-w-2xl mx-auto">
						Have a technical question, need order support, or just feedback? Our
						dedicated engineering team would absolutely love to hear from you.
					</p>
				</div>

				<div className="mb-16">
					<WhatsAppSupport />
				</div>

				{/* Hyper-Rounded Content block */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="p-8 lg:p-10 rounded-[2.5rem] bg-secondary/40 border-0 flex flex-col items-center justify-center text-center transition-transform duration-[160ms] ease-out hover:-translate-y-1">
						<div className="w-[54px] h-[54px] rounded-full bg-foreground flex items-center justify-center mb-6 shadow-sm">
							<Mail className="h-5 w-5 text-background" />
						</div>
						<h3 className="font-display text-xl font-medium mb-2 tracking-tight">
							Direct Email
						</h3>
						<p className="text-[15px] text-muted-foreground/80 font-light">
							support@kryvostore.com
						</p>
					</div>

					<div className="p-8 lg:p-10 rounded-[2.5rem] bg-secondary/40 border-0 flex flex-col items-center justify-center text-center transition-transform duration-[160ms] ease-out hover:-translate-y-1">
						<div className="w-[54px] h-[54px] rounded-full bg-foreground flex items-center justify-center mb-6 shadow-sm">
							<MessageSquare className="h-5 w-5 text-background" />
						</div>
						<h3 className="font-display text-xl font-medium mb-2 tracking-tight">
							Response Time
						</h3>
						<p className="text-[15px] text-muted-foreground/80 font-light">
							Within 24 Hours
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<Input
							placeholder="Full Name"
							required
							className="bg-secondary/30"
							maxLength={100}
						/>
						<Input
							type="email"
							placeholder="Email Address"
							required
							className="bg-secondary/30"
							maxLength={255}
						/>
					</div>
					<Input
						placeholder="Subject Header"
						required
						className="bg-secondary/30"
						maxLength={200}
					/>
					<Textarea
						placeholder="How can we help you today?"
						required
						className="bg-secondary/30"
						maxLength={2000}
					/>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="w-full h-[60px] text-[16px] rounded-full bg-foreground text-background shadow-lg mt-4"
					>
						{isSubmitting ? "Transmitting..." : "Send Message"}
					</Button>
				</form>

				{/* FAQ Section Appended */}
				<div className="mt-40 pt-16 border-t border-border/40">
					<h2 className="font-display tracking-[[-0.03em]] text-4xl lg:text-5xl font-normal leading-[0.95] mb-4 text-center">
						Frequently Asked Questions
					</h2>
					<p className="text-[16px] text-muted-foreground/80 font-light leading-relaxed max-w-2xl mx-auto text-center mb-16">
						Find immediate answers to common technical queries and service
						details.
					</p>

					<Accordion type="single" collapsible className="space-y-4">
						{faqs.map((faq, i) => (
							<AccordionItem
								key={i}
								value={`faq-${i}`}
								className="rounded-[2rem] bg-secondary/30 border-0 px-8 lg:px-10 data-[state=open]:bg-secondary/60 transition-colors duration-[160ms] ease-out"
							>
								<AccordionTrigger className="text-left font-display font-normal hover:no-underline py-6 text-[18px] lg:text-[20px] tracking-tight">
									{faq.q}
								</AccordionTrigger>
								<AccordionContent className="text-[15px] lg:text-[16px] text-muted-foreground/80 font-light leading-relaxed pb-8">
									{faq.a}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</div>
	);
};

export default Contact;
