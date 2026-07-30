import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/app/actions";
import { formatPrice } from "@/utils/currency";
import CountUp from "@/components/CountUp";
import {
  ArrowLeft,
  Bell,
  Package,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Home,
  ChevronRight,
  Activity,
  Plus,
  Search,
  Target,
  Zap,
  Sparkles,
} from "lucide-react";

function getCommonCurrency(products) {
  const currencies = products.map((p) => p.currency).filter(Boolean);
  if (currencies.length === 0) return "INR";
  const counts = {};
  currencies.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
  return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), "INR");
}

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

function MetricCard({ icon: Icon, label, value, subtext, trend }) {
  return (
    <div className="group relative rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-950 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group-hover:from-brand/20 group-hover:to-brand/10 transition-all duration-300">
          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-brand transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            {typeof value === "number" ? <CountUp to={value} duration={2} /> : value}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
          {subtext && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{subtext}</div>
          )}
        </div>
      </div>
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
  const commonCurrency = getCommonCurrency(products);
  const isEmpty = products.length === 0 && total === 0;

  return (
    <>
      <Header user={user} />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white font-semibold">Products</span>
        </nav>

        {/* Page Header - More balanced */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl tracking-tight">
                Tracked Products
              </h1>
              <span className="inline-flex items-center justify-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                {total}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Monitor prices and get notified when they drop
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/60 dark:border-gray-800 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {isEmpty ? (
          /* ── Empty State ── */
          <div className="max-w-3xl mx-auto text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5 dark:from-brand/30 dark:to-brand/10">
                  <Package className="h-10 w-10 text-brand" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Start tracking your first product
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Add products you're interested in and we'll monitor prices for you. Get instant alerts when they drop to your target price.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
              {[
                {
                  icon: Search,
                  title: "Paste URL",
                  desc: "Copy any product link from your favorite store",
                  iconBg: "from-brand/20 to-brand/5",
                  iconColor: "text-brand",
                  cardBg: "from-brand/5 to-transparent",
                  border: "border-brand/10",
                },
                {
                  icon: Target,
                  title: "Set target",
                  desc: "Enter your desired price and we'll watch it",
                  iconBg: "from-brand/15 to-brand/5",
                  iconColor: "text-brand",
                  cardBg: "from-brand/5 to-transparent",
                  border: "border-brand/10",
                },
                {
                  icon: Zap,
                  title: "Get alerts",
                  desc: "We'll notify you instantly when price drops",
                  iconBg: "from-brand/20 to-brand/5",
                  iconColor: "text-brand",
                  cardBg: "from-brand/5 to-transparent",
                  border: "border-brand/10",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`p-4 rounded-xl border ${item.border} bg-gradient-to-br ${item.cardBg} hover:shadow-md transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.iconBg} shadow-sm mb-3`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-brand-foreground font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand/30"
            >
              <Plus className="h-5 w-5" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            {/* ── Dashboard Summary ── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
              <MetricCard
                icon={ShoppingCart}
                label="Products"
                value={total}
                subtext="Total tracked"
              />
              <MetricCard
                icon={Bell}
                label="Alerts"
                value={metrics.activeAlerts}
                subtext="With target prices"
              />
              <MetricCard
                icon={TrendingDown}
                label="Price Drops"
                value={metrics.priceDrops}
                subtext="Recent drops detected"
              />
              <MetricCard
                icon={Wallet}
                label="Avg Savings"
                value={metrics.avgSavings > 0 ? formatPrice(metrics.avgSavings, commonCurrency) : formatPrice(0, commonCurrency)}
                subtext="Per drop on average"
              />
            </div>

            {/* ── Product Grid ── */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <Pagination page={page} totalPages={totalPages} />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Showing page {page} of {totalPages} · {total} {total === 1 ? "product" : "products"} total
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}