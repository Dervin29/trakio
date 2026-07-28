import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages }) {
  const pages = [];

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");
  if (end < totalPages) pages.push(totalPages);

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
      <nav
        aria-label="Pagination"
        className="flex items-center gap-1"
      >
        {/* Previous */}
        {page > 1 ? (
          <Link
            href={`/products?page=${page - 1}`}
            aria-label="Go to previous page"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-600 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        {/* Page Numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-gray-400 dark:text-gray-500"
            >
              &hellip;
            </span>
          ) : (
            <Link
              key={p}
              href={`/products?page=${p}`}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors ${
                p === page
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {page < totalPages ? (
          <Link
            href={`/products?page=${page + 1}`}
            aria-label="Go to next page"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-300 dark:border-gray-800 dark:text-gray-600 cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </nav>

      <span className="text-sm text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}