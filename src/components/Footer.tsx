import { useState } from "react";
import { Link } from "react-router-dom";
import {
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	MapPin,
	Phone,
	Mail,
	Loader2,
	CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setStatus("loading");
		// Simulate API call for newsletter subscription
		setTimeout(() => {
			setStatus("success");
			setEmail("");

			// Reset success message after 5 seconds
			setTimeout(() => {
				setStatus("idle");
			}, 5000);
		}, 1500);
	};

	return (
		<footer className="bg-background pt-32 pb-8 border-t border-border">
			<div className="container mx-auto px-6 lg:px-8 max-w-6xl">
				{/* Newsletter Section */}
				<div className="bg-gradient-to-b from-[#FCFCFC] to-[#F8F8F8] rounded-[2.5rem] p-10 lg:p-20 text-center mb-24 lg:mb-32 relative overflow-hidden border border-black/[0.04] shadow-[0_2px_40px_-15px_rgba(0,0,0,0.03)]">
					{/* Subtle staggered geometric block pattern background (CSS simulation) */}
					<div className="absolute inset-0 pointer-events-none flex items-stretch overflow-hidden mix-blend-multiply opacity-60">
						<div className="flex-1 border-r border-black/[0.02] bg-black/[0.01] mt-20"></div>
						<div className="flex-1 border-r border-black/[0.02] mb-32 bg-black/[0.02]"></div>
						<div className="flex-1 border-r border-black/[0.02] mt-40 bg-black/[0.015]"></div>
						<div className="flex-1 border-r border-black/[0.02] my-12 bg-black/[0.01]"></div>
						<div className="flex-1 border-r border-black/[0.02] mt-10 mb-40 bg-black/[0.03]"></div>
						<div className="flex-1 border-r border-black/[0.02] mb-16 bg-black/[0.01]"></div>
						<div className="flex-1 border-r border-black/[0.02] my-24 bg-black/[0.02]"></div>
						<div className="flex-1 border-r border-black/[0.02] mt-32 bg-black/[0.015]"></div>
						<div className="flex-1 mb-20 bg-black/[0.02]"></div>
					</div>

					<div className="relative z-10 w-full flex flex-col items-center">
						<h2 className="font-display text-3xl lg:text-[3.25rem] font-light leading-[1.5] mb-6 tracking-tight text-foreground">
							Subscribe to our email
							<br />
							newsletter <br className="md:hidden" />
							and get 15% off
						</h2>
						<p className="text-muted-foreground/70 mb-10 max-w-[650px] mx-auto text-[13px] leading-relaxed">
							Be the first to know about the latest in tech trends, exclusive
							offers, and exciting
							<br className="hidden sm:block" /> product launches by subscribing
							to our newsletter.
						</p>
						<form
							onSubmit={handleSubscribe}
							className="w-full max-w-[480px] mx-auto"
						>
							<div className="flex items-center bg-background rounded-full p-2 w-full shadow-sm border border-border/50 transition-all focus-within:shadow-md focus-within:border-foreground/30 hover:border-border/80">
								<Input
									type="email"
									required
									disabled={status === "loading" || status === "success"}
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-[46px] px-6 shadow-none flex-1 text-[15px] placeholder:text-muted-foreground/60 placeholder:font-light disabled:opacity-50"
								/>
								<Button
									type="submit"
									disabled={
										status === "loading" || status === "success" || !email
									}
									className="rounded-full bg-foreground text-background hover:bg-foreground/80 h-[48px] px-8 font-medium text-[14px] shadow-none transition-all duration-[200ms] active:scale-[0.97]"
								>
									{status === "loading" ? (
										<Loader2 className="h-4 w-4 animate-spin my-0.5 mx-4" />
									) : status === "success" ? (
										"Subscribed!"
									) : (
										"Subscribe"
									)}
								</Button>
							</div>

							<div className="mt-4 h-6 flex items-center justify-center overflow-hidden">
								{status === "success" && (
									<p className="text-[#329971] text-[14px] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
										<CheckCircle2 className="w-4 h-4" /> You've been
										successfully added to our list!
									</p>
								)}
							</div>
						</form>
					</div>
				</div>

				{/* Links Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
					{/* Brand & Socials */}
					<div className="space-y-6">
						<Link
							to="/"
							className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight group"
						>
							<span className="text-foreground pt-0.5">KRYVO STORE</span>
						</Link>
						<p className="text-[14px] text-muted-foreground/90 leading-relaxed max-w-xs">
							Selling premium tech products, designed to elevate your everyday
							experience.
						</p>
						<div className="flex items-center gap-3 pt-2">
							<a
								href="#"
								className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground hover:bg-foreground hover:text-background hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
							>
								<Facebook className="h-[18px] w-[18px]" />
							</a>
							<a
								href="#"
								className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground hover:bg-foreground hover:text-background hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
							>
								<Twitter className="h-[18px] w-[18px]" />
							</a>
							<a
								href="https://www.instagram.com/kryvostore.in?igsh=bHY2aXo4ajYwMnMy"
								target="_blank"
								rel="noopener noreferrer"
								className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground hover:bg-foreground hover:text-background hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
							>
								<Instagram className="h-[18px] w-[18px]" />
							</a>
							<a
								href="#"
								className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary/80 text-foreground hover:bg-foreground hover:text-background hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
							>
								<Linkedin className="h-[18px] w-[18px]" />
							</a>
						</div>
					</div>

					{/* Pages */}
					<div>
						<h4 className="font-semibold text-lg mb-6 tracking-tight">Pages</h4>
						<div className="flex flex-col gap-3.5">
							<Link
								to="/"
								className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
							>
								Home
							</Link>
							<Link
								to="/collections"
								className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
							>
								Shop
							</Link>
							<Link
								to="/about"
								className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
							>
								About
							</Link>
						</div>
					</div>

					{/* About */}
					<div>
						<h4 className="font-semibold text-lg mb-6 tracking-tight">About</h4>
						<div className="flex flex-col gap-3.5">
							<Link
								to="/contact"
								className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
							>
								Contact & FAQ
							</Link>
							<Link
								to="/collections"
								className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
							>
								Product
							</Link>
							<Link
								to="/404"
								className="text-[14px] text-muted-foreground/80 hover:text-foreground hover:translate-x-1 transition-all duration-200"
							>
								Theme 404
							</Link>
						</div>
					</div>

					{/* Contact Us */}
					<div>
						<h4 className="font-semibold text-lg mb-6 tracking-tight">
							Contact Us
						</h4>
						<div className="flex flex-col gap-5">
							<div className="flex items-start gap-3.5 text-[14px] text-muted-foreground/90 leading-relaxed group">
								<div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
									<MapPin className="h-[16px] w-[16px]" />
								</div>
								<span className="pt-1.5">Kuttikkatoor, Kozhikode, Kerala</span>
							</div>
							<div className="flex items-start gap-3.5 text-[14px] text-muted-foreground/90 leading-relaxed group">
								<div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
									<Phone className="h-[16px] w-[16px]" />
								</div>
								<div className="flex flex-col pt-1.5 gap-1">
									<a
										href="tel:+919061061442"
										className="hover:text-foreground transition-colors"
									>
										+91 90610 61442
									</a>
									<a
										href="tel:+919605655712"
										className="hover:text-foreground transition-colors"
									>
										+91 96056 55712
									</a>
								</div>
							</div>
							<div className="flex items-center gap-3.5 text-[14px] text-muted-foreground/90 leading-relaxed group">
								<div className="h-9 w-9 shrink-0 rounded-full bg-secondary/80 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
									<Mail className="h-[16px] w-[16px]" />
								</div>
								<a
									href="mailto:kryvostore.in@gmail.com"
									className="hover:text-foreground transition-colors"
								>
									kryvostore.in@gmail.com
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-[13px] text-muted-foreground/80 font-light">
						© {new Date().getFullYear()} KRYVO. All rights reserved.
					</p>
					<div className="flex gap-6">
						<Link
							to="/terms"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							Terms & Conditions
						</Link>
						<Link
							to="/privacy"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							to="/refund"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};
