"use client";

import type { LucideIcon } from "lucide-react";
import {
	Share2,
	Link2,
	Facebook,
	Linkedin,
	MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSiteUrl } from "@/lib/site";

type ProductShareProps = {
	title: string;
	slug: string;
};

type SocialItem =
	| {
			name: string;
			href: string;
			Icon: LucideIcon;
	  }
	| {
			name: string;
			href: string;
			Icon: null;
			fallbackChar: string;
	  };

export function ProductShare({ title, slug }: ProductShareProps) {
	const site = getSiteUrl();
	const productUrl = `${site}/product/${slug}`;
	const encodedUrl = encodeURIComponent(productUrl);
	const encodedTitle = encodeURIComponent(title);

	const canNativeShare =
		typeof navigator !== "undefined" && typeof navigator.share === "function";

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(productUrl);
			toast.success("Link copied to clipboard", {
				description: "You can paste it in a message or post.",
			});
		} catch {
			toast.error("Could not copy — try selecting the address bar instead.");
		}
	};

	const shareNative = async () => {
		try {
			await navigator.share({
				title,
				text: `Check this out: ${title}`,
				url: productUrl,
			});
		} catch {
			/* user cancelled or share failed */
		}
	};

	const social: SocialItem[] = [
		{
			name: "Share on Facebook",
			href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
			Icon: Facebook,
		},
		{
			name: "Share on X",
			href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
			Icon: null,
			fallbackChar: "𝕏",
		},
		{
			name: "Share on LinkedIn",
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
			Icon: Linkedin,
		},
		{
			name: "Share on WhatsApp",
			href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
			Icon: MessageCircle,
		},
	];

	return (
		<div className="mt-6 rounded-2xl border border-border/60 bg-secondary/25 px-4 py-4 sm:px-5 sm:py-5 dark:bg-secondary/15">
			<div className="mb-4">
				<h3 className="font-display text-[15px] font-medium tracking-tight text-foreground">
					Share this product
				</h3>
				<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
					Copy the link or open your favorite app to send it to someone.
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-2">
					<Button
						type="button"
						variant="default"
						size="sm"
						className="h-10 rounded-full px-4 text-[13px] font-medium shadow-sm"
						onClick={copyLink}
					>
						<Link2 className="mr-2 h-4 w-4" aria-hidden />
						Copy link
					</Button>
					{canNativeShare ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-10 rounded-full border-border/80 bg-background px-4 text-[13px] font-medium"
							onClick={shareNative}
						>
							<Share2 className="mr-2 h-4 w-4" aria-hidden />
							Share…
						</Button>
					) : null}
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
					<span className="text-[12px] font-medium text-foreground/80">
						Share on social
					</span>
					<div className="flex flex-wrap items-center gap-2">
						{social.map((item) => (
							<a
								key={item.name}
								href={item.href}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/85 shadow-sm transition-colors duration-150 hover:border-foreground/20 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								aria-label={item.name}
							>
								{item.Icon ? (
									<item.Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
								) : (
									<span className="font-sans text-[13px] font-bold leading-none">
										{"fallbackChar" in item ? item.fallbackChar : ""}
									</span>
								)}
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
