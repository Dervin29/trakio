import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/app/actions";
import { formatPrice } from "@/utils/currency";
import {
  ArrowLeft,
  Bell,
  Package,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Home,
  ChevronRight,
  Activity,
  Plus,
  Search,
  Target,
  Zap,
} from "lucide-react";

function computeMetrics(products, total) {
  const activeAlerts = products.filter((p) => p.target_price != null).length;
  const withDrops = products.filter(
    (p) => p.price_change !== null && p.price_change < 0
  );
  const priceDrops = withDrops.length;
  let avgSavings = 0;
  if (withDrops.length > 0) {
    const totalSavings = withDrops.reduce((sum, p) => {
      const prevPrice = p.current_price / (1 + p.price_change / 100);
      return sum + (prevPrice - p.current_price);
    }, 0);
    avgSavings = totalSavings / withDrops.length;
  }
  return { activeAlerts, priceDrops, avgSavings };
}

function MetricCard({ icon: Icon, label, value, subtext }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      {subtext && (
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</div>
      )}
    </div>
  );
}

export default async function ProductsPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { products, total, page, totalPages } = await getProducts(currentPage);
  const metrics = computeMetrics(products, total);
  const isEmpty = products.length === 0 && total === 0;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <Header user={user} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white font-medium">Products</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Tracked Products
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monitor prices and get notified when they drop
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {isEmpty ? (
          /* ── Empty State ── */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Package className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products yet
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Add your first product to start tracking prices and get instant alerts on drops.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
              {[
                {
                  icon: Search,
                  title: "Paste URL",
                  desc: "Copy any product link",
                },
                {
                  icon: Target,
                  title: "Set target",
                  desc: "Enter your desired price",
                },
                {
                  icon: Zap,
                  title: "Get alerts",
                  desc: "We'll notify you instantly",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 mb-3">
                    <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            {/* ── Dashboard Summary ── */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
              <MetricCard
                icon={ShoppingCart}
                label="Products"
                value={total}
                subtext="Total tracked"
              />
              <MetricCard
                icon={Bell}
                label="Active Alerts"
                value={metrics.activeAlerts}
                subtext="With target price"
              />
              <MetricCard
                icon={TrendingDown}
                label="Price Drops"
                value={metrics.priceDrops}
                subtext="Recent drops"
              />
              <MetricCard
                icon={DollarSign}
                label="Avg Savings"
                value={metrics.avgSavings > 0 ? formatPrice(metrics.avgSavings, "USD") : "$0.00"}
                subtext="Per price drop"
              />
            </div>

            {/* ── Product Grid ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <Pagination page={page} totalPages={totalPages} />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Showing page {page} of {totalPages} ({total} {total === 1 ? "product" : "products"})
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}