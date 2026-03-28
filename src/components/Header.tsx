"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingCart, User, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuthStore } from "@/stores/authStore";
import { FavoritesDrawer } from "@/components/FavoritesDrawer";
import { AuthDialog } from "@/components/AuthDialog";
import { SearchDialog } from "@/components/SearchDialog";

const navLinks = [
	{ to: "/collections", label: "All Product" },
	{ to: "/about", label: "About Us" },
	{ to: "/contact", label: "Contact" },
];

interface HeaderProps {
	onCartOpen: () => void;
}

export const Header = ({ onCartOpen }: HeaderProps) => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isAuthOpen, setIsAuthOpen] = useState(false);
	const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const pathname = usePathname();
	const totalItems = useCartStore((s) =>
		s.items.reduce((sum, item) => sum + item.quantity, 0),
	);
	const totalFavorites = useFavoritesStore((s) => s.items.length);
	const accessToken = useAuthStore((s) => s.accessToken);
	const router = useRouter();

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
					: "bg-background"
			}`}
		>
			<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
				<div className="flex items-center justify-between h-14 lg:h-16">
					{/* Left logo */}
					<Link href="/" className="group flex-shrink-0">
						<img
							src="/logo.png"
							alt="KRYVO Logo"
							className="w-24 h-24 sm:w-28 sm:h-28 object-contain -ml-2 group-hover:scale-105 transition-transform duration-300 dark:invert"
						/>
					</Link>

					{/* Center nav links */}
					<nav className="hidden lg:flex items-center gap-1 bg-secondary/60 rounded-full px-2 py-1.5 border border-secondary shadow-inner absolute left-1/2 -translate-x-1/2">
						{navLinks.map((link) => (
							<Link
								key={link.to}
								href={link.to}
								className={`text-[13px] font-medium transition-all duration-200 ease-out px-4 py-1.5 rounded-full tracking-wide ${
									pathname === link.to
										? "bg-background text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
										: "text-muted-foreground/80 hover:text-foreground hover:bg-black/[0.02]"
								}`}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Right icons */}
					<div className="flex items-center gap-1 sm:gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="hidden lg:flex h-10 w-10 min-w-10 rounded-full bg-secondary hover:bg-secondary/80 text-foreground relative"
							onClick={() => setIsSearchOpen(true)}
						>
							<Search className="h-5 w-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="hidden lg:flex h-10 w-10 min-w-10 rounded-full bg-secondary hover:bg-secondary/80 text-foreground relative"
							onClick={() => setIsFavoritesOpen(true)}
						>
							<Heart className="h-5 w-5" />
							{totalFavorites > 0 && (
								<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] bg-foreground text-background border-none p-0 leading-none">
									{totalFavorites}
								</Badge>
							)}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-10 w-10 min-w-10 rounded-full bg-secondary hover:bg-secondary/80 text-foreground relative"
							onClick={onCartOpen}
						>
							<ShoppingCart className="h-5 w-5" />
							{totalItems > 0 && (
								<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] bg-foreground text-background border-none p-0 leading-none">
									{totalItems}
								</Badge>
							)}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={`hidden lg:flex h-10 w-10 min-w-10 rounded-full transition-colors ${accessToken ? "bg-foreground text-background hover:bg-foreground hover:text-white" : "bg-secondary hover:bg-secondary/80 text-foreground"}`}
							onClick={() =>
								accessToken ? router.push("/account") : setIsAuthOpen(true)
							}
						>
							<User className="h-5 w-5" />
						</Button>

						{/* Mobile menu toggle (Moved to Right) */}
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden text-foreground ml-1 h-10 w-10 min-w-10 rounded-full bg-secondary hover:bg-secondary/80 relative"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>
			</div>

			<FavoritesDrawer
				open={isFavoritesOpen}
				onOpenChange={setIsFavoritesOpen}
			/>
			<AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
			<SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

			{/* Mobile menu */}
			<div
				className={`lg:hidden transition-all duration-300 overflow-hidden ${
					isMobileMenuOpen ? "max-h-[500px] border-b border-border" : "max-h-0"
				}`}
			>
				<nav className="container mx-auto px-6 pb-6 pt-2 flex flex-col gap-2 bg-background">
					{navLinks.map((link) => (
						<Link
							key={link.to}
							href={link.to}
							onClick={() => setIsMobileMenuOpen(false)}
							className={`text-base font-medium transition-colors py-3 border-b border-border/40 ${
								pathname === link.to
									? "text-foreground"
									: "text-muted-foreground"
							}`}
						>
							{link.label}
						</Link>
					))}
					<Link
						href="/track-order"
						onClick={() => setIsMobileMenuOpen(false)}
						className="text-base font-medium text-muted-foreground py-3 border-b border-border/40"
					>
						Track Order
					</Link>

					{/* Mobile Secondary Actions (Search, Favorites, Account) */}
					<div className="flex flex-col gap-1 pt-2 mt-2">
						<button
							className="flex items-center gap-3 text-[15px] font-medium py-3 text-muted-foreground hover:text-foreground text-left"
							onClick={() => {
								setIsSearchOpen(true);
								setIsMobileMenuOpen(false);
							}}
						>
							<Search className="h-5 w-5" /> Search Products
						</button>
						<button
							className="flex items-center gap-3 text-[15px] font-medium py-3 text-muted-foreground hover:text-foreground text-left"
							onClick={() => {
								setIsFavoritesOpen(true);
								setIsMobileMenuOpen(false);
							}}
						>
							<Heart className="h-5 w-5" /> Saved Favorites{" "}
							{totalFavorites > 0 && (
								<span className="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">
									{totalFavorites}
								</span>
							)}
						</button>
						<button
							className="flex items-center gap-3 text-[15px] font-medium py-3 text-muted-foreground hover:text-foreground text-left"
							onClick={() => {
								accessToken ? router.push("/account") : setIsAuthOpen(true);
								setIsMobileMenuOpen(false);
							}}
						>
							<User className="h-5 w-5" />{" "}
							{accessToken ? "My Account" : "Sign In"}
						</button>
					</div>
				</nav>
			</div>
		</header>
	);
};


