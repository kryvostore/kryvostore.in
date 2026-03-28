import { Zap, Heart, Target } from "lucide-react";

const About = () => {
	return (
		<div className="min-h-screen bg-background pt-[140px] pb-32">
			<div className="container mx-auto px-6 lg:px-8 max-w-6xl">
				{/* Massive Hero Typography */}
				<div className="mb-32">
					<h1 className="font-display tracking-[[-0.03em]] text-6xl lg:text-7xl font-medium leading-[0.95] mb-8">
						About <br className="hidden lg:block" /> Kryvo Store
					</h1>
					<p className="text-[17px] lg:text-[19px] text-muted-foreground/80 font-light leading-relaxed max-w-2xl">
						We believe technology should enhance your life, not complicate it.
						KRYVO STORE curates the world's finest smart home and lifestyle
						goods, bringing precision-engineered innovation directly to your
						fingertips.
					</p>
				</div>

				{/* Hyper-Rounded Mission Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-32">
					{[
						{
							icon: Zap,
							title: "Innovation First",
							desc: "We source cutting-edge tech that pushes boundaries while remaining intrinsically accessible to everyone.",
						},
						{
							icon: Heart,
							title: "Quality Obsessed",
							desc: "Every single product is relentlessly tested and vetted by our engineering team before it reaches your hands.",
						},
						{
							icon: Target,
							title: "Customer Focused",
							desc: "Your absolute satisfaction is our mission. We provide direct, exceptional support at every single step.",
						},
					].map((item, i) => (
						<div
							key={i}
							className="p-10 lg:p-12 rounded-[2.5rem] bg-secondary/40 border-0 transition-transform duration-[160ms] ease-out hover:-translate-y-1"
						>
							<div className="w-[60px] h-[60px] rounded-full bg-foreground flex items-center justify-center mb-8 shadow-md">
								<item.icon className="h-[22px] w-[22px] text-background" />
							</div>
							<h3 className="font-display text-2xl font-medium mb-4 tracking-tight">
								{item.title}
							</h3>
							<p className="text-[15px] text-muted-foreground/80 font-light leading-relaxed">
								{item.desc}
							</p>
						</div>
					))}
				</div>

				{/* The Origin Story - Premium Spacing */}
				<div className="max-w-4xl mx-auto text-center pt-16 border-t border-border/40">
					<h2 className="font-display tracking-tight text-4xl lg:text-5xl font-medium mb-8">
						Our Origin
					</h2>
					<div className="space-y-6 text-[16px] text-muted-foreground/90 font-light leading-relaxed">
						<p>
							Founded with a distinctly simple vision: to make smart living
							beautiful and accessible. We started as industrial design
							enthusiasts deeply frustrated by the aesthetic gap between raw
							engineering innovation and everyday contemporary consumer goods.
						</p>
						<p>
							Today, we serve a global, discerning customer base, carefully
							curating electronic architecture that are not just gadgets — they
							are meticulously crafted tools for a better, smarter life.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
