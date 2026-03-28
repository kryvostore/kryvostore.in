"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
const heroProduct =
	"/generated/product_headphones_transparent_1774676465954.png";
const watchProduct = "/generated/product_watch_transparent_1774676450623.png";
const displaysProduct =
	"/generated/product_display_transparent_1774676483014.png";
const phonesProduct = "/generated/product_phones_transparent_1774676501120.png";
const avatar1 = "/generated/avatar_1_1774675165218.png";
const avatar2 = "/generated/avatar_2_1774675181855.png";

const Index = () => {
	return (
		<div className="min-h-screen bg-background pb-20 font-sans">
			{/* Hero Section */}
			<section className="pt-24 lg:pt-32 pb-12">
				<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:min-h-[600px]">
						{/* Hero Left */}
						<div className="bg-secondary p-6 lg:p-9 rounded-[2.5rem] flex flex-col justify-between">
							<div>
								<h1 className="text-[2.5rem] sm:text-5xl lg:text-[3rem] font-extralight leading-[1.1] tracking-tight mb-3 text-foreground">
									Elevate your lifestyle
									<br className="hidden sm:block" /> with premium essentials.
								</h1>
								<p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-[420px]">
									Elevate your routine with premium goods and curated
									essentials, combining quality and style to enhance comfort,
									convenience, and sophistication in every moment of your day.
								</p>
								<div className="flex items-center gap-3 mt-6">
									<Link href="/collections" tabIndex={-1}>
										<Button className="rounded-full bg-[#111] text-white hover:bg-[#111]/90 shadow-md h-[54px] px-8 font-normal text-[15px]">
											Browse All Products
										</Button>
									</Link>
									<Link href="/collections" className="group" tabIndex={-1}>
										<Button
											size="icon"
											className="h-[54px] w-[54px] rounded-full border-none bg-[#111] hover:bg-[#111]/90 text-white shadow-md flex-shrink-0"
										>
											<ArrowUpRight className="h-[22px] w-[22px] text-white group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform duration-[160ms] ease-out stroke-[2px]" />
										</Button>
									</Link>
								</div>
							</div>

							<div className="bg-background rounded-[2rem] p-5 lg:p-6 flex justify-between items-stretch flex-col md:flex-row mt-12 sm:mt-16 w-full shadow-sm gap-6 md:gap-0">
								<div className="flex-1 flex flex-col items-start md:pr-6 relative z-10">
									<span className="inline-block text-[11px] font-medium bg-secondary px-4 py-1.5 rounded-full mb-4 sm:mb-6 text-foreground">
										Featured
									</span>
									<h4 className="font-normal text-2xl mb-2 text-foreground">
										eWatsh SF 4
									</h4>
									<p className="text-xs text-muted-foreground leading-relaxed mb-4 sm:mb-6 max-w-[180px]">
										eWatsh SF 4: Smartwatch with fitness tracking and sleek
										design.
									</p>
									<div className="font-semibold text-base text-foreground mt-auto">
										USD 349.99
									</div>
								</div>
								<div className="w-full md:w-[45%] h-[200px] md:h-auto shrink-0 flex items-center justify-center relative bg-secondary rounded-[1.5rem] overflow-hidden md:overflow-visible">
									<img
										src={watchProduct}
										alt="eWatch SF 4"
										className="w-[75%] h-[75%] md:w-[130%] md:h-[130%] md:max-w-none object-contain absolute z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-700"
									/>
								</div>
							</div>
						</div>

						{/* Hero Right */}
						<div className="bg-secondary p-6 lg:p-9 rounded-[2.5rem] relative flex flex-col justify-between group overflow-hidden min-h-[500px]">
							<div className="inline-flex relative z-10">
								<span className="text-[11px] font-medium bg-background px-4 py-1.5 rounded-full text-foreground shadow-sm">
									Featured
								</span>
							</div>

							<div className="absolute inset-0 flex items-center justify-center pb-20">
								<img
									src={heroProduct}
									alt="Headphones x-28m"
									className="w-[85%] max-w-[500px] object-contain group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
								/>
							</div>

							{/* Bottom Frosted Overlay */}
							<div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-background/50 backdrop-blur-md border-t border-border/20 lg:p-9 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4">
								<div className="relative z-10 max-w-[280px]">
									<h3 className="font-light text-2xl sm:text-3xl mb-1 sm:mb-2 text-foreground">
										Headphones x-28m
									</h3>
									<p className="text-xs text-foreground/80 leading-relaxed drop-shadow-sm">
										Headphones X-28M: Superior sound, sleek design, noise
										cancellation, and all-day comfort.
									</p>
								</div>
								<div className="relative z-10 font-semibold tracking-tight text-xl lg:text-2xl whitespace-nowrap text-foreground">
									USD 149.99
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-20 lg:py-24">
				<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-5xl font-light tracking-tight mb-4">
							Browser by categories
						</h2>
						<p className="text-muted-foreground text-sm lg:text-base max-w-lg mx-auto">
							Explore our diverse range of categories tailored to meet your
							specific needs and interests.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
						{/* Left large card */}
						<div className="lg:col-span-5 bg-background border border-border rounded-[2rem] p-8 lg:p-10 flex flex-col justify-between">
							<div className="w-full aspect-square bg-secondary rounded-3xl mb-8 flex items-center justify-center p-8 group">
								<img
									src={watchProduct}
									alt="All Products"
									className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-md"
								/>
							</div>
							<div>
								<h3 className="text-2xl font-normal mb-3">All Product</h3>
								<p className="text-muted-foreground text-sm leading-relaxed mb-8">
									Discover endless possibilities with our All Products category.
									Shop now for everything you need in one convenient place.
								</p>
								<div className="flex items-center gap-3">
									<Link href="/collections" tabIndex={-1}>
										<Button className="rounded-full bg-[#111] text-white hover:bg-[#111]/90 shadow-md h-[54px] px-8 font-normal text-[15px]">
											Browse All Products
										</Button>
									</Link>
									<Link href="/collections" className="group" tabIndex={-1}>
										<Button
											size="icon"
											className="h-[54px] w-[54px] rounded-full border-none bg-[#111] hover:bg-[#111]/90 text-white shadow-md flex-shrink-0"
										>
											<ArrowUpRight className="h-[22px] w-[22px] text-white group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform duration-[160ms] ease-out stroke-[2px]" />
										</Button>
									</Link>
								</div>
							</div>
						</div>

						{/* Right column */}
						<div className="lg:col-span-7 flex flex-col gap-6">
							{/* Top horizontal card */}
							<div className="bg-secondary rounded-[2rem] p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 h-full">
								<div className="flex-1 max-w-sm">
									<h3 className="text-2xl font-normal mb-3">Displays</h3>
									<p className="text-muted-foreground text-sm leading-relaxed mb-6">
										Experience crystal-clear clarity and vibrant visuals with
										our Displays.
									</p>
									<Link
										href="/collections"
										className="group inline-flex items-center gap-3 bg-background hover:bg-background/90 transition-all hover:-translate-y-0.5 rounded-full pl-6 pr-1.5 py-1.5 shadow-sm border border-transparent hover:shadow-md"
									>
										<span className="text-xs font-normal">View More</span>
										<div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-background transition-colors">
											<ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
										</div>
									</Link>
								</div>
								<div className="w-full sm:w-1/2 flex items-center justify-center">
									<img
										src={displaysProduct}
										alt="Displays"
										className="w-[80%] object-contain drop-shadow-lg"
									/>
								</div>
							</div>

							{/* Bottom twin cards */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{/* Headphones */}
								<div className="bg-secondary rounded-[2rem] p-8 flex flex-col justify-between">
									<div className="w-full aspect-square mb-6 flex items-center justify-center">
										<img
											src={heroProduct}
											alt="Headphones"
											className="w-[80%] object-contain drop-shadow-md"
										/>
									</div>
									<div className="flex items-end justify-between gap-4">
										<div>
											<h3 className="text-xl font-normal mb-2">Headphones</h3>
											<p className="text-muted-foreground text-xs leading-relaxed max-w-[180px]">
												Premium headphones: Superior sound, comfort, and style.
											</p>
										</div>
										<Link
											href="/collections"
											className="group bg-background rounded-full p-3 shadow-md border-none hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all flex-shrink-0"
										>
											<ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
										</Link>
									</div>
								</div>

								{/* Phones */}
								<div className="bg-secondary rounded-[2rem] p-8 flex flex-col justify-between">
									<div className="w-full aspect-square mb-6 flex items-center justify-center">
										<img
											src={phonesProduct}
											alt="Phones"
											className="w-[70%] object-contain drop-shadow-md"
										/>
									</div>
									<div className="flex items-end justify-between gap-4">
										<div>
											<h3 className="text-xl font-normal mb-2">Phones</h3>
											<p className="text-muted-foreground text-xs leading-relaxed max-w-[180px]">
												Sleek phones: Advanced technology, performance, and
												connectivity.
											</p>
										</div>
										<Link
											href="/collections"
											className="group bg-background rounded-full p-3 shadow-md border-none hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all flex-shrink-0"
										>
											<ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 lg:py-24 overflow-hidden">
				<div className="container mx-auto px-6 lg:px-8 max-w-7xl">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
						<div>
							<h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-4">
								What customers are saying
							</h2>
							<p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
								Experience the convenience and satisfaction shared by our
								thriving community of shoppers who trust our ecommerce store for
								their every purchase.
							</p>
						</div>
						<div className="flex gap-3">
							<Button
								variant="outline"
								size="icon"
								className="group rounded-full h-12 w-12 border-none shadow-sm bg-background hover:bg-background/80 hover:scale-105 transition-all text-foreground"
							>
								<ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
							</Button>
							<Button
								size="icon"
								className="group rounded-full h-12 w-12 bg-foreground hover:bg-foreground/80 hover:scale-105 transition-all text-background shadow-md"
							>
								<ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform duration-300" />
							</Button>
						</div>
					</div>

					<div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
						{[
							{
								name: "Alex K.",
								avatar: avatar1,
								title: "Exceptional Headphones and Service!",
								desc: "I couldn't be happier with my purchase from this store. The headphones I bought exceeded my expectations in terms of sound quality and comfort. Plus, the customer service was excellent. Highly recommend!",
							},
							{
								name: "Emily J.",
								avatar: avatar2,
								title: "Online Purchase Worth Every Penny!",
								desc: "I was skeptical about buying headphones online, but I'm so glad I did. These headphones are fantastic! They are comfortable to wear for long periods, and the sound isolation is amazing. Definitely worth every penny.",
							},
							{
								name: "Michael R.",
								avatar: avatar1,
								title: "Great Product, Fast Delivery",
								desc: "The delivery was surprisingly fast, and the packaging was excellent. The displays monitor is very vibrant and perfect for my design work. A great addition to my workspace.",
							},
						].map((testimonial, i) => (
							<div
								key={i}
								className="min-w-[320px] lg:min-w-[450px] max-w-[450px] bg-secondary rounded-[2rem] p-8 lg:p-10 flex flex-col justify-between shrink-0 snap-start"
							>
								<div className="flex justify-between items-start mb-8">
									<div className="h-16 w-16 lg:h-20 lg:w-20 rounded-full overflow-hidden bg-background border border-border">
										<img
											src={testimonial.avatar}
											alt={testimonial.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="text-6xl text-muted-foreground/30 font-serif leading-none h-12">
										&ldquo;
									</div>
								</div>

								<div className="bg-background rounded-3xl p-6 lg:p-8 flex-1 flex flex-col shadow-sm border border-border/50">
									<h4 className="text-xl lg:text-2xl font-normal mb-4 text-foreground/90">
										{testimonial.title}
									</h4>
									<p className="text-sm text-muted-foreground mb-8 leading-relaxed flex-1">
										{testimonial.desc}
									</p>

									<div className="mt-auto">
										<div className="font-normal text-lg mb-2">
											{testimonial.name}
										</div>
										<div className="flex gap-1 text-[#FBBF24]">
											{[...Array(5)].map((_, j) => (
												<Star key={j} className="h-4 w-4 fill-current" />
											))}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Index;


