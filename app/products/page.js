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
  Sparkles,
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

function MetricCard({ icon: Icon, label, value, subtext, delay }) {
  return (
    <div
      className="group relative animate-fade-in-up rounded-2xl border border-gray-200/50 bg-white/70 dark:border-gray-700/50 dark:bg-gray-900/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light/60 text-brand transition-colors group-hover:bg-brand-light">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
        {subtext && (
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{subtext}</p>
        )}
      </div>
    </div>
  );
}

function MetricCardCurrency({ icon: Icon, label, value, subtext, delay }) {
  return (
    <div
      className="group relative animate-fade-in-up rounded-2xl border border-gray-200/50 bg-white/70 dark:border-gray-700/50 dark:bg-gray-900/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light/60 text-brand transition-colors group-hover:bg-brand-light">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </span>
        <p className="mt-0.5 text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
        {subtext && (
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{subtext}</p>
        )}
      </div>
    </div>
  );
}

function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-brand-light/40 to-transparent blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-gradient-to-tl from-brand-300/20 to-transparent blur-3xl" />
      <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-brand-light/30 to-transparent blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-light/20 dark:from-gray-950 dark:via-gray-900 dark:to-brand-dark/10">
      <BackgroundEffects />
      <Header user={user} />

      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex animate-fade-in items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500"
        >
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-gray-700 dark:text-gray-200">Products</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex animate-fade-in-up flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                Tracked Products
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/80 dark:border-emerald-800/40 dark:bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                Active Monitoring
              </span>
            </div>
            <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              Monitor prices and get notified when they drop
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white hover:shadow-md active:scale-[0.97]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {isEmpty ? (
          /* ── Empty State ── */
          <div className="animate-fade-in-up">
            <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200/50 bg-white/60 dark:border-gray-700/50 dark:bg-gray-900/60 p-8 text-center shadow-sm backdrop-blur-xl sm:p-12 lg:p-16">
              <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
                <div className="absolute inset-0 animate-float rounded-3xl bg-gradient-to-br from-brand-light/60 to-brand-300/30" />
                <div className="absolute inset-2 animate-pulse-soft rounded-2xl bg-gradient-to-br from-brand-light/80 to-brand-300/20" />
                <Package className="relative h-12 w-12 text-brand" />
              </div>

              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Start tracking your first product
              </h2>
              <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Never miss a price drop again. Add a product URL, set your target
                price, and get instant alerts when the price hits your goal.
              </p>

              <div className="mx-auto mb-10 grid gap-4 text-left md:grid-cols-3">
                {[
                  {
                    icon: Search,
                    step: "01",
                    title: "Paste Product URL",
                    desc: "Copy any product link from your favorite store",
                  },
                  {
                    icon: Target,
                    step: "02",
                    title: "Set Target Price",
                    desc: "Tell us the price you&apos;re waiting for",
                  },
                  {
                    icon: Zap,
                    step: "03",
                    title: "Receive Instant Alerts",
                    desc: "We&apos;ll notify you the moment it drops",
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="animate-slide-up rounded-2xl border border-gray-100 bg-white/80 dark:border-gray-800 dark:bg-gray-800/80 p-5 shadow-sm transition-all duration-200 hover:border-brand-light/40 dark:hover:border-brand-dark/40 hover:shadow-md"
                    style={{ animationDelay: `${0.2 + i * 0.12}s` }}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light/60 text-brand">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand to-brand-dark px-8 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/30 active:scale-[0.97]"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  Add Your First Product
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-8 text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white hover:shadow-md active:scale-[0.97]"
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  Learn How It Works
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Dashboard Summary ── */}
            <div className="mb-10 grid animate-fade-in gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={ShoppingCart}
                label="Total Products"
                value={total}
                subtext="Across all categories"
                delay={0.05}
              />
              <MetricCard
                icon={Bell}
                label="Active Alerts"
                value={metrics.activeAlerts}
                subtext="Products with target price"
                delay={0.1}
              />
              <MetricCard
                icon={TrendingDown}
                label="Price Drops"
                value={metrics.priceDrops}
                subtext="Products with recent drops"
                delay={0.15}
              />
              <MetricCardCurrency
                icon={DollarSign}
                label="Avg Savings per Drop"
                value={metrics.avgSavings > 0 ? formatPrice(metrics.avgSavings, "USD") : "$0.00"}
                subtext="Average savings on drops"
                delay={0.2}
              />
            </div>

            {/* ── Product Grid ── */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.length > 0
                ? products.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                : null}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Showing page {page} of {totalPages} ({total}{" "}
                  {total === 1 ? "product" : "products"} total)
                </p>
                <Pagination page={page} totalPages={totalPages} />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
