import Link from "next/link";
import AddProductForm from "@/components/AddProductForm";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/app/actions";
import {
  Bell,
  Shield,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { products = [] } = user ? await getProducts() : {};

  const FEATURES = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Trakio extracts prices in seconds, handling JavaScript and dynamic content across all major platforms.",
      gradient: "from-brand to-brand-dark",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works seamlessly across all major e-commerce sites with built-in anti-bot protection and smart retry logic.",
      gradient: "from-brand to-brand-dark",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Get notified instantly when prices drop below your target. Never miss a deal on your favorite products.",
      gradient: "from-brand to-brand-dark",
    },
  ];

  const STATS = [
    { label: "Products Tracked", value: products.length },
    {
      label: "Price Drops Found",
      value: products.reduce((acc, p) => acc + (p.price_drops?.length || 0), 0),
    },
    {
      label: "Active Alerts",
      value: products.filter((p) => p.price_alert_active).length,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 dark:from-gray-950 via-white dark:via-gray-900 to-brand-light/30 dark:to-brand-dark/10">
      <Header user={user} />

      <section className="relative py-16 sm:py-28 lg:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -right-20 w-72 h-72 bg-brand-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-light/80 to-brand-light text-brand-700 px-6 py-2 rounded-full text-sm font-medium mb-6 border border-brand-300/50 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Built by Alan Derwin
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-[1.1]">
            Never miss a{" "}
            <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
              deal
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Track prices from any major e-commerce site with just a few clicks.
            Get instant alerts when prices drop below your target.
          </p>

          <div className="max-w-2xl mx-auto">
            <AddProductForm user={user} />
          </div>

          {user && products.length > 0 && (
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-brand-dark hover:text-brand-700 font-medium text-sm bg-brand-light hover:bg-brand-light/80 px-6 py-3 rounded-full border border-brand-300 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                View your tracked products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {user && products.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-8">
              {STATS.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
              {FEATURES.map(({ icon: Icon, title, description, gradient }) => (
                <div
                  key={title}
                  className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-gray-700 hover:border-brand-300 transition-all duration-300 hover:shadow-lg hover:shadow-brand-light/50 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 mx-auto shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-28 -mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-gray-600 p-12 text-center transition-all hover:border-brand-muted hover:bg-brand-light/30">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-light/80 to-brand-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingDown className="w-10 h-10 text-brand" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              Add your first product above to start tracking prices and never
              miss a deal
            </p>
            <div className="mt-6 flex justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-muted" />
                Enter product URL
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-muted" />
                Set target price
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-muted" />
                Get alerts
              </span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
