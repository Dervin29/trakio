import { Home, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";

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
          <div key={i} className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5 dark:bg-zinc-900 dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] dark:ring-white/5">
            
            {/* Responsive Layout: Mobile/Tablet (vertical), Desktop (horizontal) */}
            <div className="flex flex-col lg:flex-row h-full">
              
              {/* Image Section */}
              <div className="relative w-full lg:w-56 xl:w-64 flex-shrink-0 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="relative w-full pt-[100%] sm:pt-[75%] lg:pt-[100%]">
                  <div className="absolute inset-0 p-3">
                    <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
                      <div className="h-full w-full animate-pulse bg-gray-200 dark:bg-gray-700" />
                      
                      {/* Gradient overlay placeholder */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 via-transparent" />
                    </div>
                  </div>
                </div>

                {/* Badge placeholders */}
                <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                  <div className="h-5 w-16 rounded-lg bg-emerald-500/20 animate-pulse" />
                </div>

                <div className="absolute right-3 top-3">
                  <div className="h-5 w-12 rounded-lg bg-white/50 dark:bg-zinc-900/50 animate-pulse" />
                </div>

                <div className="absolute bottom-3 right-3">
                  <div className="h-5 w-12 rounded-lg bg-white/50 dark:bg-zinc-900/50 animate-pulse" />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5 lg:p-4 xl:p-5">
                
                {/* Product Name */}
                <div className="space-y-2">
                  <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Price Section */}
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div className="space-y-1">
                    <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Savings percentage (mobile) */}
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700 lg:hidden" />

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-3 w-px bg-gray-200 dark:bg-gray-700" />
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>

                {/* Target Progress Placeholder */}
                <div className="rounded-xl bg-zinc-50 p-2.5 sm:p-3 space-y-1.5 sm:space-y-2 dark:bg-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-full w-1/3 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-2 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-2 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[100px] h-9 sm:h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-9 sm:h-10 w-9 sm:w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="h-9 sm:h-10 w-9 sm:w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}