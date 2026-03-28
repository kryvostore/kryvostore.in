import { Skeleton } from "@/components/ui/skeleton";

/**
 * Default route transition skeleton (home, collections, static pages).
 */
export function GenericPageSkeleton() {
	return (
		<div className="min-h-[70vh] bg-background pb-24 pt-[100px] lg:pt-[120px]">
			<div className="container mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
					<Skeleton className="mx-auto mb-4 h-8 w-48 rounded-lg md:h-10 md:w-64" />
					<Skeleton className="mx-auto mb-2 h-4 w-full max-w-xl rounded-md" />
					<Skeleton className="mx-auto h-4 w-full max-w-lg rounded-md" />
				</div>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} className="flex flex-col gap-3">
							<Skeleton className="aspect-[4/3] w-full rounded-2xl" />
							<Skeleton className="h-4 max-w-[85%] rounded-md" />
							<Skeleton className="h-4 w-1/3 rounded-md" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
