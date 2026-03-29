import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

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
 * Full shop layout skeleton: matches `Collections` — slate hero, mesh, filters, grid.
 * Used by `app/collections/page.tsx` Suspense fallback.
 */
export function CollectionsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex w-full min-h-[min(52vh,440px)] sm:min-h-[min(48vh,400px)] items-end overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-[120px] pb-14 sm:pb-16 lg:pb-20">
        {/* Static mesh (no client SVG) — echoes Collections hero */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_20%_30%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_60%,rgba(255,255,246,0.06),transparent_55%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90" />
        <div
          className="pointer-events-none absolute left-[8%] top-[22%] h-40 w-40 rounded-full bg-white/5 blur-3xl sm:h-52 sm:w-52"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[12%] top-[35%] h-36 w-36 rounded-full bg-blue-400/10 blur-3xl sm:h-44 sm:w-44"
          aria-hidden
        />

        <div className="relative z-10 mb-8 w-full px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="max-w-lg">
              <Skeleton className="mb-4 h-12 w-36 rounded-lg bg-white/20 sm:h-14 lg:h-16 lg:w-44" />
              <Skeleton className="mb-2 h-4 w-full max-w-[390px] rounded-md bg-white/15" />
              <Skeleton className="h-4 w-full max-w-[320px] rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-[4rem] min-h-[60vh] w-full rounded-t-[2.5rem] bg-background pt-12 lg:rounded-t-[3.5rem]">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 flex flex-col justify-between gap-6 px-2 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3 overflow-hidden pb-4 lg:pb-0">
              {["w-28", "w-32", "w-28", "w-24", "w-28"].map((w, i) => (
                <Skeleton
                  key={i}
                  className={`h-[54px] shrink-0 rounded-full ${w}`}
                />
              ))}
            </div>
            <div className="relative w-full min-w-0 lg:w-auto lg:min-w-[320px]">
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
