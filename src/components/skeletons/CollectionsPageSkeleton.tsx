import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

/** Product grid placeholders — matches ProductCard layout (image, lines, CTA). */
export function CollectionsGridSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 gap-6 pb-32 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="flex flex-col gap-3">
					<Skeleton className="aspect-square w-full rounded-2xl bg-muted/80" />
					<Skeleton className="h-4 max-w-[90%] rounded-md" />
					<Skeleton className="h-4 w-1/3 rounded-md" />
					<Skeleton className="mt-1 h-10 w-full rounded-full" />
				</div>
			))}
		</div>
	);
}

/**
 * Full Shop / collections layout: gray hero, overlapping panel, filter pills, search, grid.
 * Used by `app/collections/loading.tsx` and can mirror client loading state.
 */
export function CollectionsPageSkeleton() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero — same shell as Collections (gray + bottom-aligned title) */}
			<div className="relative flex min-h-screen w-full items-end overflow-hidden bg-[#c9c9c9] pb-20 pt-[140px] lg:pb-24">
				<div className="pointer-events-none absolute inset-0">
					<Skeleton className="absolute -left-8 top-[12%] h-64 w-64 rounded-full opacity-40 lg:h-80 lg:w-80" />
					<Skeleton className="absolute right-[18%] top-[8%] h-32 w-32 rounded-full opacity-35" />
					<Skeleton className="absolute left-[38%] top-[28%] h-24 w-24 rounded-2xl opacity-30" />
					<Skeleton className="absolute -bottom-8 right-[-5%] h-72 w-72 rounded-full opacity-35 lg:h-96 lg:w-96" />
				</div>
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/45" />

				<div className="relative z-10 mb-8 w-full px-6 lg:px-8">
					<div className="container mx-auto max-w-7xl">
						<div className="max-w-lg">
							<Skeleton className="mb-4 h-14 w-40 rounded-lg bg-white/25 lg:h-16 lg:w-48" />
							<Skeleton className="mb-2 h-4 w-full max-w-[390px] rounded-md bg-white/20" />
							<Skeleton className="h-4 w-full max-w-[340px] rounded-md bg-white/15" />
						</div>
					</div>
				</div>
			</div>

			{/* Overlapping panel */}
			<div className="relative z-20 -mt-[4rem] min-h-[60vh] w-full rounded-t-[2.5rem] bg-background pt-12 lg:rounded-t-[3.5rem]">
				<div className="container mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mb-16 flex flex-col justify-between gap-6 px-2 lg:flex-row lg:items-center">
						<div className="flex items-center gap-3 overflow-hidden pb-4 lg:pb-0">
							{["w-32", "w-36", "w-28", "w-24", "w-28"].map((w, i) => (
								<Skeleton
									key={i}
									className={`h-12 shrink-0 rounded-full ${w}`}
								/>
							))}
						</div>
						<div className="relative w-full min-w-[320px] lg:w-auto">
							<Search className="absolute left-6 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground/40" />
							<Skeleton className="h-[54px] w-full rounded-full lg:min-w-[320px]" />
						</div>
					</div>

					<CollectionsGridSkeleton count={8} />
				</div>
			</div>
		</div>
	);
}
