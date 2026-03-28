import { Skeleton } from "@/components/ui/skeleton";

export function CartPageSkeleton() {
	return (
		<div className="min-h-[70vh] bg-background px-6 pb-20 pt-28">
			<div className="container mx-auto max-w-3xl">
				<Skeleton className="mb-8 h-4 w-36 rounded-md" />
				<Skeleton className="mb-2 h-9 w-48 rounded-lg" />
				<Skeleton className="mb-10 h-4 w-24 rounded-md" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex gap-4 rounded-2xl border border-border/30 bg-secondary/20 p-4"
						>
							<Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
							<div className="flex flex-1 flex-col justify-center gap-2">
								<Skeleton className="h-4 w-2/3 max-w-xs rounded-md" />
								<Skeleton className="h-4 w-20 rounded-md" />
								<div className="mt-2 flex gap-2">
									<Skeleton className="h-8 w-24 rounded-full" />
									<Skeleton className="h-8 w-8 rounded-full" />
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="mt-10 flex justify-between border-t border-border/40 pt-8">
					<Skeleton className="h-6 w-24 rounded-md" />
					<Skeleton className="h-10 w-40 rounded-full" />
				</div>
			</div>
		</div>
	);
}
