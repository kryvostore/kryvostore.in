"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronRight } from "lucide-react";
import Link from "next/link";

const COOKIE_KEY = "kryvo_cookie_consent";

export const CookieConsent = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem(COOKIE_KEY);
		if (!consent) {
			// Small delay so it doesn't pop instantly on load
			const timer = setTimeout(() => setVisible(true), 1500);
			return () => clearTimeout(timer);
		}
	}, []);

	const accept = () => {
		localStorage.setItem(COOKIE_KEY, "accepted");
		setVisible(false);
	};

	const decline = () => {
		localStorage.setItem(COOKIE_KEY, "declined");
		setVisible(false);
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ y: 120, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 120, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="fixed bottom-0 left-0 right-0 z-[100] w-full px-6 pb-4 pt-2"
				>
					<div className="relative w-full max-w-7xl mx-auto bg-background/95 backdrop-blur-xl border border-border/60 rounded-[2rem] shadow-[0_8px_48px_rgba(0,0,0,0.16)] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
						{/* Icon */}
						<div className="w-10 h-10 min-w-10 rounded-full bg-foreground flex items-center justify-center shadow-sm">
							<Cookie className="h-4 w-4 text-background" />
						</div>

						{/* Text */}
						<div className="flex-1 min-w-0">
							<p className="text-[13.5px] font-medium text-foreground mb-0.5">
								We use cookies
							</p>
							<p className="text-[12.5px] text-muted-foreground leading-relaxed">
								We use cookies to enhance your browsing experience and analyze
								traffic.{" "}
								<Link
									href="/privacy"
									className="underline underline-offset-2 hover:text-foreground transition-colors"
									onClick={decline}
								>
									Privacy Policy
								</Link>
							</p>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-2 shrink-0">
							<button
								type="button"
								onClick={decline}
								className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
							>
								Decline
							</button>
							<button
								type="button"
								onClick={accept}
								className="flex items-center gap-1 text-[13px] font-medium bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 transition-colors"
							>
								Accept <ChevronRight className="h-3.5 w-3.5" />
							</button>
						</div>

						{/* Dismiss X */}
						<button
							type="button"
							onClick={decline}
							className="absolute top-3 right-4 text-muted-foreground hover:text-foreground transition-colors"
							aria-label="Dismiss"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};


