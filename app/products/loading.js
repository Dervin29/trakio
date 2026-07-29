import { Home, ChevronRight, Sparkles, ArrowLeft } from "lucide-react";

export default function ProductsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-white font-semibold">Products</span>
      </nav>

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="relative w-full bg-gray-100 dark:bg-gray-800" style={{ paddingBottom: "75%" }}>
              <div className="absolute inset-0 p-3">
                <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-auto flex items-center gap-1 pt-2.5 border-t border-gray-100/60 dark:border-gray-800/60">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 h-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
