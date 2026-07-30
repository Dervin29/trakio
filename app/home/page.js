import { redirect } from "next/navigation";
import AddProductForm from "@/components/AddProductForm";
import Header from "@/components/Header";
import DotField from "@/components/DotField";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/app/actions";
import { Search, Target, Zap, TrendingDown, Sparkles } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { products = [] } = await getProducts();

  return (
    <main className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <DotField />
      <div className="relative z-10">
        <Header user={user} />

        {/* ── Hero Section ── */}
        <section className="relative flex items-center justify-center px-4 py-20 sm:py-28 overflow-hidden">
          <div className="bg-glow pointer-events-none absolute inset-0" />
          <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-brand/5 to-transparent blur-3xl" />

          <div className="w-full max-w-3xl mx-auto text-center relative">
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200/60 dark:border-gray-700/60 px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Track prices smarter
            </div>

            <h1 className="animate-fade-in-up text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""}
            </h1>

            <p className="animate-fade-in-up text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Paste a product URL below to start tracking, or browse your existing products.
            </p>

            <div className="animate-fade-in-up max-w-xl mx-auto">
              <AddProductForm user={user} />
            </div>

            {products.length === 0 && (
              <div className="animate-fade-in-up mt-12 text-center p-8 rounded-xl border-2 border-dashed border-gray-200/80 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 hover:border-brand/50 dark:hover:border-brand/50 transition-all cursor-default group shadow-sm">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 group-hover:from-brand/20 group-hover:to-brand/10 transition-colors flex items-center justify-center shadow-sm">
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

        {/* ── How It Works Section ── */}
        <section className="relative px-4 py-20 sm:py-28 bg-gray-50/80 dark:bg-gray-900/80 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.03]" />
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200/60 dark:border-gray-700/60 px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 mb-4">
                <Search className="w-3.5 h-3.5" />
                Simple process
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                How it works
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
                Three simple steps to never miss a deal
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Paste a product URL",
                  desc: "Copy the link of any product from Amazon, Flipkart, Myntra, or hundreds of other online stores.",
                },
                {
                  step: "02",
                  icon: Target,
                  title: "Set your target price",
                  desc: "Tell us the price you're willing to pay. We'll start monitoring it around the clock.",
                },
                {
                  step: "03",
                  icon: Zap,
                  title: "Get notified instantly",
                  desc: "The moment the price drops to your target, we'll send you an alert so you can grab the deal.",
                },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div
                  key={step}
                  className="group relative p-6 sm:p-8 rounded-2xl card-depth hover:border-brand/30 dark:hover:border-brand/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/[0.02] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-4xl sm:text-5xl font-black text-gray-100 dark:text-gray-800 absolute top-4 right-4 leading-none select-none group-hover:text-brand/10 dark:group-hover:text-brand/20 transition-colors">
                    {step}
                  </span>
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-sm group-hover:from-brand/20 group-hover:to-brand/10 transition-all duration-300 mb-5">
                      <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-brand transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
