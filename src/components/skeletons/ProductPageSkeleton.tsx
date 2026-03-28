import { Skeleton } from "@/components/ui/skeleton";

/**
 * Matches ProductPage layout: gallery + info, shipping line, share panel, related grid.
 */
export function ProductPageSkeleton() {
	return (
		<div className="min-h-screen bg-background pb-24 pt-[100px] lg:pb-32 lg:pt-[120px]">
			<div className="container mx-auto max-w-7xl px-6 lg:px-8">
				<div className="relative mb-16 grid grid-cols-1 items-start gap-8 lg:mb-24 lg:grid-cols-2 lg:gap-5">
					{/* Gallery */}
					<div className="flex h-full flex-col gap-4 lg:flex-row lg:items-stretch">
						<Skeleton className="aspect-square max-h-[500px] flex-1 rounded-[2rem] bg-muted/80" />
						<div className="hidden shrink-0 gap-3 lg:flex lg:w-[100px] lg:flex-col xl:w-[150px]">
							<Skeleton className="aspect-square w-full rounded-xl xl:rounded-[1.25rem]" />
							<Skeleton className="aspect-square w-full rounded-xl xl:rounded-[1.25rem]" />
							<Skeleton className="aspect-square w-full rounded-xl xl:rounded-[1.25rem]" />
						</div>
					</div>

					{/* Info column */}
					<div className="flex max-h-max flex-col lg:sticky lg:top-32 lg:py-4 lg:pl-8">
						<Skeleton className="mb-4 h-9 max-w-md rounded-lg" />
						<Skeleton className="mb-4 h-4 w-full max-w-[95%] rounded-md" />
						<Skeleton className="mb-4 h-4 w-full max-w-[90%] rounded-md" />
						<div className="mb-4 flex gap-1">
							{[1, 2, 3, 4, 5].map((i) => (
								<Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
							))}
						</div>
						<Skeleton className="mb-8 h-9 w-36 rounded-md" />

						<div className="mb-8 flex flex-col gap-5">
							<div>
								<Skeleton className="mb-3 h-3 w-24 rounded-md" />
								<div className="flex flex-wrap gap-2">
									<Skeleton className="h-9 w-20 rounded-full" />
									<Skeleton className="h-9 w-20 rounded-full" />
									<Skeleton className="h-9 w-20 rounded-full" />
								</div>
							</div>
							<div className="flex justify-between gap-4">
								<div>
									<Skeleton className="mb-3 h-3 w-16 rounded-md sm:ml-auto" />
									<Skeleton className="h-10 w-[110px] rounded-md" />
								</div>
							</div>
						</div>

						<div className="mb-6 flex w-full gap-3">
							<Skeleton className="h-14 flex-1 rounded-full md:h-[60px]" />
							<Skeleton className="h-14 w-14 shrink-0 rounded-full md:h-[60px] md:w-[60px]" />
						</div>

						<div className="mb-6 space-y-2">
							<Skeleton className="h-3 w-full max-w-xl rounded-md" />
							<Skeleton className="h-3 w-full max-w-lg rounded-md" />
						</div>

						<Skeleton className="h-32 w-full rounded-2xl" />
					</div>
				</div>

				{/* Mid promo strip (matches delivery box height) */}
				<Skeleton className="mb-16 h-32 w-full rounded-[2rem] lg:mb-24 lg:h-36" />

				{/* Related */}
				<div className="mb-16 border-t border-border/40 pt-12 lg:mb-0 lg:pt-16">
					<Skeleton className="mb-8 h-10 max-w-xs rounded-lg" />
					<div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="flex flex-col gap-3">
								<Skeleton className="aspect-square w-full rounded-2xl" />
								<Skeleton className="h-4 w-3/4 rounded-md" />
								<Skeleton className="h-4 w-1/2 rounded-md" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
