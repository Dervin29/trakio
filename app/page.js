import Link from "next/link";
import AddProductForm from "@/components/AddProductForm";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/app/actions";
import { Bell, Shield, TrendingDown, ArrowRight, BarChart3, Sparkles } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { products = [] } = user ? await getProducts() : {};

  const totalDrops = products.reduce(
    (acc, p) => acc + (p.price_drops?.length || 0),
    0
  );

  const STATS = [
    { label: "Products", value: products.length },
    { label: "Price Drops", value: totalDrops },
    { label: "Active Alerts", value: products.filter((p) => p.price_alert_active).length },
  ];

  const features = [
    {
      icon: Bell,
      title: "Real-time alerts",
      desc: "Get notified instantly when prices drop below your target.",
    },
    {
      icon: Shield,
      title: "Works everywhere",
      desc: "Supports all major e-commerce platforms out of the box.",
    },
    {
      icon: TrendingDown,
      title: "Track savings",
      desc: "Monitor price history and see how much you've saved.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <Header user={user} />

      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Track prices smarter
            </div>

            <h1 className="animate-fade-in-up text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Never miss a{" "}
              <span className="text-brand">deal</span>
            </h1>

            <p className="animate-fade-in-up text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Enter any product URL and set your target price. We'll notify you instantly when it drops.
            </p>

            <div className="animate-fade-in-up max-w-xl mx-auto">
              <AddProductForm user={user} />
            </div>

            {user && products.length > 0 && (
              <div className="animate-fade-in-up mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
                >
                  <BarChart3 className="w-4 h-4 transition-transform group-hover:scale-110" />
                  View all products
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>

          {user && products.length > 0 && (
            <div className="animate-fade-in-up mt-12 grid grid-cols-3 gap-3 max-w-md mx-auto">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand/50 dark:hover:border-brand/50 transition-all hover:shadow-sm cursor-default"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(!user || products.length === 0) && (
            <div className="animate-fade-in-up mt-16 grid sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc }, index) => (
                <div
                  key={title}
                  className="group text-center p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand/50 dark:hover:border-brand/50 transition-all hover:-translate-y-0.5 hover:shadow-sm cursor-default"
                >
                  <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-brand/10 dark:group-hover:bg-brand/20 transition-colors flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-brand transition-colors" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {user && products.length === 0 && (
            <div className="animate-fade-in-up mt-12 text-center p-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-brand/50 dark:hover:border-brand/50 transition-all cursor-default group">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-brand/10 dark:group-hover:bg-brand/20 transition-colors flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No products yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add your first product above to start tracking prices.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}