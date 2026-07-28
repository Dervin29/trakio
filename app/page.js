import Link from "next/link";
import AddProductForm from "@/components/AddProductForm";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/app/actions";
import {
  Bell,
  Rabbit,
  Shield,
  TrendingDown,
  Package,
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
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works seamlessly across all major e-commerce sites with built-in anti-bot protection and smart retry logic.",
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Get notified instantly when prices drop below your target. Never miss a deal on your favorite products.",
      gradient: "from-purple-400 to-pink-500",
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <Header user={user} />

      <section className="relative py-16 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -right-20 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-6 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200/50 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Built by Alan Derwin
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
            Never miss a{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              deal
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
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
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm bg-orange-50 hover:bg-orange-100 px-6 py-3 rounded-full border border-orange-200 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                View your tracked products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {user && products.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8">
              {STATS.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-slate-200 shadow-sm"
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description, gradient }) => (
                <div
                  key={title}
                  className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 hover:border-orange-200 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 mx-auto shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-20">
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center transition-all hover:border-orange-300 hover:bg-orange-50/30">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingDown className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Add your first product above to start tracking prices and never
              miss a deal
            </p>
            <div className="mt-6 flex justify-center gap-2 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Enter product URL
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Set target price
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Get alerts
              </span>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}