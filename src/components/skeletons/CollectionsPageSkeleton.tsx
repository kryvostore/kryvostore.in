import { Skeleton } from "@/components/ui/skeleton";

/** Product grid placeholders — matches ProductCard + collections grid gaps. */
export function CollectionsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-6 pb-32 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-square w-full rounded-xl bg-muted/80" />
          <Skeleton className="h-4 max-w-[92%] rounded-md" />
          <Skeleton className="h-4 w-2/5 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/**
 * Full shop layout skeleton: matches `Collections` — navy banner, overlapping panel, pills + sort, grid.
 * Used by `app/collections/page.tsx` Suspense fallback.
 */
export function CollectionsPageSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#001420] via-[#071a26] to-black pt-20 sm:pt-24 pb-28 sm:pb-32 lg:pb-36">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_25%,rgba(164,203,232,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <Skeleton className="mb-5 h-4 w-40 rounded-md bg-white/20" />
          <Skeleton className="mb-4 h-12 w-3/4 max-w-md rounded-lg bg-white/25 sm:h-14 lg:h-16" />
          <Skeleton className="mb-2 h-4 w-full max-w-xl rounded-md bg-white/15" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md bg-white/10" />
        </div>
      </div>

      <div className="relative z-20 -mt-14 sm:-mt-16 lg:-mt-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-t-[1.75rem] sm:rounded-t-[2rem] lg:rounded-t-[2.5rem] bg-surface-container-lowest shadow-ambient px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2.5">
              {["w-14", "w-28", "w-32", "w-28", "w-36"].map((w, i) => (
                <Skeleton
                  key={i}
                  className={`h-11 shrink-0 rounded-full ${w} bg-muted/90`}
                />
              ))}
            </div>
            <div className="flex w-full gap-3 lg:w-auto lg:min-w-[220px]">
              <Skeleton className="h-11 flex-1 rounded-full bg-muted/90 lg:hidden" />
              <Skeleton className="h-11 w-full rounded-full bg-muted/90 lg:min-w-[220px]" />
            </div>
          </div>
          <Skeleton className="mb-6 h-4 w-48 rounded-md bg-muted/70" />
          <CollectionsGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
