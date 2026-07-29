import { Home, ChevronRight, Activity } from "lucide-react";

export default function ProductDetailLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex animate-fade-in items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Home</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Products</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </nav>

      <div className="mb-8 flex animate-fade-in-up flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800 md:h-9" />
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="h-9 w-36 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column - Image + Actions + Status */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image Skeleton */}
          <div className="overflow-hidden rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900">
            <div className="relative w-full bg-gray-100 dark:bg-gray-800" style={{ paddingBottom: "75%" }}>
              <div className="absolute inset-0 p-3">
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-3" />
            <div className="space-y-2">
              <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          {/* Tracking Status Skeleton */}
          <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-4">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-3" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Info + Pricing + Insights + Chart */}
        <div className="space-y-6 lg:col-span-3">
          {/* Title Skeleton */}
          <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-6 sm:p-8">
            <div className="mb-1 h-5 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="mt-2 h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Pricing Skeleton */}
          <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-6 sm:p-8">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-1" />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800 sm:h-12 md:h-14" />
                <div className="mt-2 h-4 w-44 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="h-8 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          {/* Insights Skeleton */}
          <div className="rounded-2xl border-l-4 border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/30 p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-6 sm:p-8">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-4" />
            <div className="h-40 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </section>
  );
}
