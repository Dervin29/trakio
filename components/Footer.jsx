import Link from "next/link";
import { Package, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200/50 bg-white dark:border-gray-800/50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-brand-300/40">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Trakio</span>
            </Link>
            <p className="max-w-xs text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-left">
              Track prices automatically and never miss the perfect deal.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Products
            </Link>
            <a
              href="mailto:hello@trakio.app"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-light hover:bg-brand-light hover:text-brand hover:shadow-md dark:border-gray-700 dark:text-gray-500 dark:hover:border-brand-dark dark:hover:bg-brand-dark/20 dark:hover:text-brand"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 py-6 sm:flex-row dark:border-gray-800">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {currentYear} Trakio
            </p>
            <span className="hidden text-gray-300 dark:text-gray-600 sm:inline">·</span>
            <p className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
              Built by{" "}
              <a
                href="https://alanderwin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Alan Derwin
              </a>
            </p>
            <span className="hidden text-gray-300 dark:text-gray-600 sm:inline">·</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              v1.0
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}
