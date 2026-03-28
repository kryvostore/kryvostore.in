import { MessageCircle, ExternalLink, Clock, ShieldCheck } from "lucide-react";

export const WhatsAppSupport = () => {
	return (
		<div className="col-span-1 sm:col-span-3 lg:col-span-3 p-8 lg:p-12 rounded-[2.5rem] bg-[#25D366]/5 border border-[#25D366]/20 flex flex-col md:flex-row items-center justify-between gap-8 transition-transform duration-[160ms] ease-out hover:-translate-y-1 overflow-hidden relative group">
			{/* Background decorative elements */}
			<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#25D366]/10 blur-3xl transition-opacity duration-500 group-hover:opacity-70 opacity-30 pointer-events-none" />
			<div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[#25D366]/10 blur-2xl transition-opacity duration-500 group-hover:opacity-60 opacity-20 pointer-events-none" />

			<div className="flex flex-col items-center text-center md:items-start md:text-left z-10 max-w-xl">
				<div className="w-[60px] h-[60px] rounded-full bg-[#25D366] flex items-center justify-center mb-6 shadow-lg shadow-[#25D366]/20 ring-4 ring-[#25D366]/10">
					<MessageCircle className="h-7 w-7 text-white fill-white" />
				</div>
				<h3 className="font-display text-2xl lg:text-3xl font-medium mb-3 tracking-tight text-foreground">
					Priority WhatsApp Support
				</h3>
				<p className="text-[16px] text-muted-foreground/80 font-light leading-relaxed mb-6">
					Get instant help from our dedicated support team. We're available for technical queries, order tracking, and general assistance.
				</p>
				<div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[14px] text-muted-foreground/70 font-light">
					<div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
						<Clock className="w-4 h-4 text-[#25D366]" />
						<span>Avg. response time: ~5 mins</span>
					</div>
					<div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
						<ShieldCheck className="w-4 h-4 text-[#25D366]" />
						<span>Verified Business</span>
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full md:w-auto gap-4 z-10 min-w-[280px]">
				<a
					href="https://wa.me/919061061442"
					target="_blank"
					rel="noreferrer"
					className="group/btn flex items-center justify-between bg-background p-4 rounded-2xl border border-border/50 hover:border-[#25D366]/30 shadow-sm hover:shadow-md transition-all duration-[160ms] ease-out hover:-translate-y-0.5 active:scale-[0.98]"
				>
					<div className="flex flex-col">
						<span className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Primary Support</span>
						<span className="text-[18px] font-medium text-foreground tracking-tight group-hover/btn:text-[#25D366] transition-colors">+91 90610 61442</span>
					</div>
					<div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center group-hover/btn:bg-[#25D366]/10 transition-colors">
						<ExternalLink className="w-4 h-4 text-muted-foreground group-hover/btn:text-[#25D366] transition-colors" />
					</div>
				</a>

				<a
					href="https://wa.me/919605655712"
					target="_blank"
					rel="noreferrer"
					className="group/btn flex items-center justify-between bg-background p-4 rounded-2xl border border-border/50 hover:border-[#25D366]/30 shadow-sm hover:shadow-md transition-all duration-[160ms] ease-out hover:-translate-y-0.5"
				>
					<div className="flex flex-col">
						<span className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Secondary / Escalations</span>
						<span className="text-[18px] font-medium text-foreground tracking-tight group-hover/btn:text-[#25D366] transition-colors">+91 96056 55712</span>
					</div>
					<div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center group-hover/btn:bg-[#25D366]/10 transition-colors">
						<ExternalLink className="w-4 h-4 text-muted-foreground group-hover/btn:text-[#25D366] transition-colors" />
					</div>
				</a>
			</div>
		</div>
	);
};
