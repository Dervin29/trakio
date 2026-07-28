import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import ProductCard from "@/components/ProductCard";
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
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];
  
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
    { label: "Price Drops Found", value: products.reduce((acc, p) => acc + (p.price_drops?.length || 0), 0) },
    { label: "Active Alerts", value: products.filter(p => p.price_alert_active).length },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Header with improved design */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-200/50 transition-transform group-hover:scale-105 duration-200">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Trakio
              </span>
              <span className="hidden sm:inline-block text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full ml-2">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-semibold">
                  {user.user_metadata?.full_name?.[0] || user.email?.[0] || "U"}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
            )}
            <AuthButton user={user} />
          </div>
        </div>
      </header>

      {/* Hero Section with improved design */}
      <section className="relative py-16 sm:py-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -right-20 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-6 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200/50 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Made with ❤️ by Alan Derwin
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

          {/* Enhanced Product Form */}
          <div className="max-w-2xl mx-auto">
            <AddProductForm user={user} />
          </div>

          {/* Stats Bar */}
          {user && products.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8">
              {STATS.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Features Grid - only show when no products */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description, gradient }) => (
                <div
                  key={title}
                  className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 hover:border-orange-200 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 mx-auto shadow-lg shadow-${gradient.split(' ')[1]?.split('-')[1]}/20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Section with improved cards */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Tracked Products
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Monitor prices and get notified when they drop
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-700 border border-orange-200/50">
                {products.length} {products.length === 1 ? "product" : "products"}
              </span>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={null} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State with better design */}
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
              Add your first product above to start tracking prices and never miss a deal!
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