import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trakio
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/products" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Products
            </Link>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>&copy; {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}