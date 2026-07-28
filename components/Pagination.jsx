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
    <nav
      aria-label="Pagination"
      className="flex items-center gap-1.5"
    >
      {/* Previous */}
      {page > 1 ? (
        <Link
          href={`/products?page=${page - 1}`}
          aria-label="Go to previous page"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 hover:bg-brand-light hover:text-brand-dark"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl text-gray-300"
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
          >
            &hellip;
          </span>
        ) : (
          <Link
            key={p}
            href={`/products?page=${p}`}
            aria-label={`Go to page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-medium transition-all duration-200 ${
              p === page
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:bg-brand-light hover:text-brand-dark"
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
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-all duration-200 hover:bg-brand-light hover:text-brand-dark"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl text-gray-300"
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
