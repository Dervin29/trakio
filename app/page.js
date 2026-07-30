import { redirect } from "next/navigation";
import Header from "@/components/Header";
import DotField from "@/components/DotField";
import HeroCta from "@/components/HeroCta";
import { createClient } from "@/utils/supabase/server";
import { Bell, Shield, TrendingDown, Sparkles, Search, Target, Zap, Quote, ArrowRight } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/home");
  }

  return (
    <main className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <DotField />
      <div className="relative z-10">
        <Header user={user} />

        {/* ── Hero Section ── */}
        <section className="relative flex items-center justify-center px-4 py-24 sm:py-32 overflow-hidden">
          <div className="bg-glow pointer-events-none absolute inset-0" />
          <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-brand/5 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-gradient-to-t from-brand/3 to-transparent blur-3xl" />

          <div className="w-full max-w-4xl mx-auto text-center relative">
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200/60 dark:border-gray-700/60 px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Track prices smarter
            </div>

            <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              Never miss a{" "}
              <span className="text-brand">deal</span> again
            </h1>

            <p className="animate-fade-in-up text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed">
              Enter any product URL and set your target price. We'll monitor it 24/7 and notify you the instant it drops.
            </p>

            <div className="animate-fade-in-up">
              <HeroCta />
            </div>
          </div>
        </section>

        {/* ── How It Works Section ── */}
        <section className="relative px-4 py-20 sm:py-28 bg-gray-100/80 dark:bg-gray-900/80 border-t border-gray-200/60 dark:border-gray-800/60">
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
                Start saving money in three simple steps
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
              ].map(({ step, icon: Icon, title, desc }, i) => (
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

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200/60 dark:border-gray-700/60 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles className="w-4 h-4" />
                Completely free &mdash; no hidden charges
              </div>
            </div>
          </div>
        </section>

        {/* ── About Section ── */}
        <section className="relative px-4 py-20 sm:py-28 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="bg-glow pointer-events-none absolute inset-0" />
          <div className="max-w-4xl mx-auto relative">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200/60 dark:border-gray-700/60 px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 mb-4">
                <Quote className="w-3.5 h-3.5" />
                Why Trakio
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                About Trakio
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
                Why we built this and how it helps you save
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: TrendingDown,
                  title: "Never overpay again",
                  desc: "Prices change constantly. Trakio watches them for you so you can buy at the perfect moment without refreshing pages all day.",
                  iconBg: "from-brand/20 to-brand/5",
                  iconColor: "text-brand",
                },
                {
                  icon: Bell,
                  title: "Real-time alerts",
                  desc: "Get notified by email the second a price hits your target. No delays, no spam — just the deals that matter to you.",
                  iconBg: "from-brand/15 to-brand/5",
                  iconColor: "text-brand",
                },
                {
                  icon: Shield,
                  title: "Works everywhere",
                  desc: "Supports all major e-commerce platforms. Whether it's Amazon, Flipkart, or your favorite niche store, we've got you covered.",
                  iconBg: "from-brand/20 to-brand/5",
                  iconColor: "text-brand",
                },
                {
                  icon: Quote,
                  title: "Built for smart shoppers",
                  desc: "Trakio helps you make informed purchasing decisions with price history charts, savings tracking, and insights into price trends.",
                  iconBg: "from-brand/15 to-brand/5",
                  iconColor: "text-brand",
                },
              ].map(({ icon: Icon, title, desc, iconBg, iconColor }) => (
                <div
                  key={title}
                  className="group p-6 rounded-xl card-depth hover:border-brand/30 dark:hover:border-brand/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200/60 dark:border-gray-700/60 text-sm text-gray-500 dark:text-gray-400">
                <Sparkles className="w-4 h-4" />
                Start tracking &mdash; it&apos;s free
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
