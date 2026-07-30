import { Home, ChevronRight, Activity, Store, Target } from "lucide-react";

const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />
);

export default function ProductDetailLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:py-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 sm:mb-6 flex animate-fade-in items-center gap-1 text-xs sm:text-sm text-gray-400 dark:text-gray-500">
        <Home className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="hidden sm:inline">Home</span>
        <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span>Products</span>
        <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <SkeletonBlock className="h-3 w-16 sm:h-4 sm:w-24" />
      </nav>

      {/* Header */}
      <div className="mb-4 sm:mb-6 flex animate-fade-in-up flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 sm:space-y-2">
          <SkeletonBlock className="h-6 w-32 sm:h-7 sm:w-48 md:h-9" />
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300 dark:text-gray-600" />
            <SkeletonBlock className="h-3 w-40 sm:h-4 sm:w-64" />
          </div>
        </div>
        <SkeletonBlock className="h-8 w-28 sm:h-9 sm:w-36 rounded-lg sm:rounded-xl" />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-5">
        {/* Left Column - Image + Actions + Status */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          {/* Image Skeleton */}
          <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900">
            <div className="relative w-full" style={{ paddingBottom: "75%" }}>
              <div className="absolute inset-0 p-2 sm:p-3">
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="h-full w-full animate-pulse rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-3 sm:p-4">
            <SkeletonBlock className="h-2 w-16 sm:h-3 sm:w-24 mb-2 sm:mb-3" />
            <div className="space-y-2">
              <SkeletonBlock className="h-9 sm:h-11 w-full rounded-lg sm:rounded-xl" />
              <SkeletonBlock className="h-9 sm:h-11 w-full rounded-lg sm:rounded-xl" />
            </div>
          </div>

          {/* Tracking Status Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-3 sm:p-4">
            <SkeletonBlock className="h-2 w-16 sm:h-3 sm:w-24 mb-2 sm:mb-3" />
            <div className="space-y-2.5 sm:space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {i === 0 && <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300 dark:text-gray-600" />}
                    {i === 1 && <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300 dark:text-gray-600" />}
                    {i === 2 && <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300 dark:text-gray-600" />}
                    <SkeletonBlock className="h-3 w-14 sm:h-4 sm:w-20" />
                  </div>
                  <SkeletonBlock className="h-4 w-12 sm:h-5 sm:w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Info + Pricing + Insights + Chart */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-3">
          {/* Title Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <SkeletonBlock className="h-4 w-16 sm:h-5 sm:w-20 mb-1 rounded-lg" />
            <div className="mt-1.5 sm:mt-2 space-y-1.5 sm:space-y-2">
              <SkeletonBlock className="h-5 w-full sm:h-6" />
              <SkeletonBlock className="h-5 w-3/4 sm:h-6" />
            </div>
          </div>

          {/* Pricing Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <SkeletonBlock className="h-2 w-16 sm:h-3 sm:w-24 mb-1" />
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-end justify-between gap-2 sm:gap-3">
              <div className="w-full sm:w-auto">
                <SkeletonBlock className="h-7 w-28 sm:h-8 sm:w-32 md:h-10 md:w-40" />
                <div className="mt-0.5 sm:mt-1 flex items-center gap-2">
                  <SkeletonBlock className="h-3 w-14 sm:h-4 sm:w-20" />
                  <SkeletonBlock className="h-3 w-12 sm:h-4 sm:w-16" />
                </div>
              </div>
              <SkeletonBlock className="h-6 w-20 sm:h-8 sm:w-24 rounded-full" />
            </div>
          </div>

          {/* Insights Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border-l-4 border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/30 p-3 sm:p-4">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <SkeletonBlock className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg sm:rounded-xl" />
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                <SkeletonBlock className="h-3 w-28 sm:h-4 sm:w-40" />
                <SkeletonBlock className="h-2.5 w-40 sm:h-3 sm:w-56" />
              </div>
            </div>
          </div>

          {/* Target Price Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-300 dark:text-gray-600" />
                <SkeletonBlock className="h-3 w-16 sm:h-4 sm:w-24" />
              </div>
              <SkeletonBlock className="h-5 w-16 sm:h-6 sm:w-20" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              <SkeletonBlock className="h-12 sm:h-16 rounded-lg sm:rounded-xl" />
              <SkeletonBlock className="h-12 sm:h-16 rounded-lg sm:rounded-xl" />
            </div>
            <SkeletonBlock className="h-3 w-32 sm:h-4 sm:w-48 mt-2" />
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <SkeletonBlock className="h-2 w-12 sm:h-3 sm:w-16" />
                <SkeletonBlock className="h-2 w-8 sm:h-3 sm:w-12" />
              </div>
              <SkeletonBlock className="h-1.5 w-full rounded-full" />
              <SkeletonBlock className="h-2 w-28 sm:h-3 sm:w-40 mt-1.5" />
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900 p-4 sm:p-5">
            <SkeletonBlock className="h-3 w-24 sm:h-4 sm:w-32 mb-3 sm:mb-4" />
            <SkeletonBlock className="h-40 sm:h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}