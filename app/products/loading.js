// app/products/loading.js
import { Home, ChevronRight, Sparkles, ShoppingCart, Bell, TrendingDown, Wallet } from "lucide-react";

// Optimized skeleton card with balanced proportions
const SkeletonCard = () => (
  <div className="group relative flex h-full flex-col rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-[0_2px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:from-gray-900 dark:to-gray-950 dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] dark:ring-white/5">
    {/* Image placeholder - balanced 4:3 ratio */}
    <div className="m-3 overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200/80 to-gray-300/80 dark:from-gray-700/80 dark:to-gray-800/80 animate-pulse" />
    </div>
    
    {/* Content placeholder - balanced spacing */}
    <div className="flex flex-1 flex-col gap-3 p-4 pt-2">
      {/* Title - 2 lines */}
      <div className="space-y-1.5">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      </div>
      
      {/* Price */}
      <div className="space-y-1.5">
        <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      </div>
      
      {/* Metadata */}
      <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      
      {/* Button */}
      <div className="mt-auto pt-3">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
      </div>
      
      {/* Footer actions */}
      <div className="flex items-center justify-between pt-1">
        <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-3.5 w-14 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      </div>
    </div>
  </div>
);

// Optimized skeleton metric card
const SkeletonMetricCard = ({ icon: Icon }) => (
  <div className="group relative rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse">
        <Icon className="h-5 w-5 text-gray-400 dark:text-gray-600" />
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-2.5 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      </div>
    </div>
  </div>
);

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-white font-semibold">Products</span>
      </nav>

      {/* Header - balanced */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-5 w-8 animate-pulse rounded-full bg-brand/10" />
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            <div className="h-4 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Stats Cards - balanced grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        <SkeletonMetricCard icon={ShoppingCart} />
        <SkeletonMetricCard icon={Bell} />
        <SkeletonMetricCard icon={TrendingDown} />
        <SkeletonMetricCard icon={Wallet} />
      </div>

      {/* Product Grid with balanced skeletons */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-9 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
        <div className="h-3 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </section>
  );
}