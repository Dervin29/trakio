import { Home, ChevronRight, Sparkles } from "lucide-react";

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-white font-semibold">Products</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-brand/10" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Sparkles className="h-4 w-4 text-gray-300 dark:text-gray-600" />
            <div className="h-4 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-950 p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-7 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="group relative flex h-full flex-col rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-[0_2px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:from-gray-900 dark:to-gray-950 dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] dark:ring-white/5">

            {/* Image Section */}
            <div className="m-3 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
              <div className="relative aspect-[1/1]">
                <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 via-transparent" />

                {/* Badge placeholders */}
                <div className="absolute left-2.5 top-2.5">
                  <div className="h-5 w-16 animate-pulse rounded-md bg-white/90 dark:bg-gray-900/90" />
                </div>
                <div className="absolute right-2.5 top-2.5">
                  <div className="h-5 w-12 animate-pulse rounded-md bg-white/90 dark:bg-gray-900/90" />
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <div className="h-5 w-16 animate-pulse rounded-md bg-emerald-500/20" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col gap-4 p-5 pt-4">
              {/* Product Name */}
              <div className="space-y-2">
                <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Price Section */}
              <div className="space-y-2">
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Target Progress */}
              <div className="rounded-xl bg-gray-50 p-3 space-y-2 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="h-full w-1/3 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
                </div>
                <div className="h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 space-y-3">
                <div className="h-11 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
