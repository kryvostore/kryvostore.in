import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Using localized 3D transparent product assets
const headphonesImg =
	"/generated/product_headphones_transparent_1774676465954.png";
const displaysImg = "/generated/product_display_transparent_1774676483014.png";
const watchImg = "/generated/product_watch_transparent_1774676450623.png";
const phonesImg = "/generated/product_phones_transparent_1774676501120.png";

const CATEGORIES = ["All Product", "Headphones", "Displays", "Watch", "Phones"];

const Collections = () => {
	const { data: products, isLoading } = useProducts(50);
	const [activeCategory, setActiveCategory] = useState("All Product");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredProducts = products
		? products.filter((p) => {
				// Very simple local filtering logic
				const title = p.node.title.toLowerCase();
				if (searchQuery && !title.includes(searchQuery.toLowerCase()))
					return false;

				if (activeCategory === "All Product") return true;
				if (activeCategory === "Headphones" && title.includes("headphone"))
					return true;
				if (activeCategory === "Displays" && title.includes("display"))
					return true;
				if (
					activeCategory === "Watch" &&
					(title.includes("watch") || title.includes("band"))
				)
					return true;
				if (activeCategory === "Phones" && title.includes("phone")) return true;

				// Fallback if the category logic misses something just show it in All
				return false;
			})
		: [];

	return (
		<div className="min-h-screen bg-background">
			{/* 3D Scattered Dark Gray Hero Section */}
			<div className="w-full bg-[#c9c9c9] relative pt-[140px] pb-20 lg:pb-24 overflow-hidden min-h-screen flex items-end">
				{/* Floating Background 3D Objects */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
					{/* Main Left Headphones */}
					<img
						src={headphonesImg}
						alt="Hero Headphones"
						className="absolute -left-16 lg:left-[5%] top-[10%] w-[380px] lg:w-[480px] object-contain -rotate-[15deg] drop-shadow-2xl"
					/>
					{/* Small Top Right Phones/Earbuds proxy */}
					<img
						src={phonesImg}
						alt="Floating Phones"
						className="absolute right-[20%] lg:right-[15%] top-[5%] w-[180px] object-contain rotate-12 opacity-80 mix-blend-multiply drop-shadow-xl"
					/>
					{/* Watch proxy for the floating middle object */}
					<img
						src={watchImg}
						alt="Floating Watch"
						className="absolute left-[40%] top-[25%] w-[120px] drop-shadow-lg object-contain rotate-[35deg] opacity-70 mix-blend-multiply"
					/>
					{/* Bottom Right Massive Headphone Cropped */}
					<img
						src={headphonesImg}
						alt="Hero Headphones Cropped"
						className="absolute right-[-15%] lg:right-[0%] -bottom-[10%] w-[450px] lg:w-[650px] object-contain rotate-[10deg] drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] mix-blend-multiply opacity-90 scale-x-[-1]"
					/>
					{/* Small earbuds at the bottom center */}
					<img
						src={displaysImg}
						alt="Bottom Displays"
						className="absolute left-[38%] bottom-[5%] w-[200px] object-contain opacity-60 mix-blend-multiply drop-shadow-xl"
					/>
				</div>

				{/* Background Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>

				{/* Hero Content */}
				<div className="container mx-auto px-6 lg:px-8 max-w-6xl relative z-10 w-full mb-8">
					<div className="max-w-lg">
						<h1 className="text-white text-5xl lg:text-6xl font-display font-medium leading-[1] mb-4 tracking-tight">
							Shop
						</h1>
						<p className="text-white/85 text-[15px] leading-normal max-w-[390px] font-light">
							Browse our wide selection of products, thoughtfully crafted to
							meet your needs with quality and convenience in mind.
						</p>
					</div>
				</div>
			</div>

			{/* Overlapping Content Container */}
			<div className="bg-background rounded-t-[2.5rem] lg:rounded-t-[3.5rem] relative -mt-[4rem] z-20 w-full min-h-[60vh] pt-12">
				<div className="container mx-auto px-6 lg:px-8 max-w-6xl">
					{/* Filter Pill Row */}
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-16 px-2">
						<div className="flex items-center gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide scroll-smooth">
							{CATEGORIES.map((cat) => (
								<button
									key={cat}
									onClick={() => setActiveCategory(cat)}
									className={`shrink-0 rounded-full px-7 py-3 text-[14px] transition-all duration-150 ease-out active:scale-95 ${
										activeCategory === cat
											? "bg-foreground text-background font-medium shadow-md"
											: "bg-transparent border border-border/80 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
									}`}
								>
									{cat}
								</button>
							))}
						</div>

						<div className="relative w-full lg:w-auto min-w-[320px]">
							<Search className="absolute left-6 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70" />
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search..."
								className="w-full rounded-full pl-14 h-[54px] border-border/60 bg-transparent text-[15px] shadow-sm transition-all focus-visible:ring-1 focus-visible:ring-foreground focus-visible:border-foreground/50"
							/>
						</div>
					</div>

					{/* Product Grid */}
					{isLoading ? (
						<div className="flex items-center justify-center py-32">
							<Loader2 className="h-10 w-10 animate-spin text-foreground" />
						</div>
					) : filteredProducts.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 pb-32">
							{filteredProducts.map((product) => (
								<ProductCard key={product.node.id} product={product} />
							))}
						</div>
					) : (
						<div className="text-center py-32 rounded-[2rem] border border-dashed border-border/60 bg-secondary/20 mb-20">
							<p className="text-foreground text-xl mb-3 font-medium">
								No products match your criteria
							</p>
							<p className="text-sm text-muted-foreground max-w-sm mx-auto">
								Try adjusting your filters or search query to find what you're
								looking for.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Collections;
