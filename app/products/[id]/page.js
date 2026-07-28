import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import ProductDetails from "@/components/ProductDetails";
import { createClient } from "@/utils/supabase/server";
import { getProduct } from "@/app/actions";
import { ArrowLeft, Home, ChevronRight, Activity } from "lucide-react";

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

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-light/20 dark:from-gray-950 dark:via-gray-900 dark:to-brand-dark/10">
      <BackgroundEffects />
      <Header user={user} />

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
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
          <Link
            href="/products"
            className="transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="max-w-[120px] truncate font-medium text-gray-700 sm:max-w-[200px] dark:text-gray-200">
            {product.name}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex animate-fade-in-up flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl dark:text-white">
              Product Details
            </h1>
            <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              View detailed pricing and tracking information
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-gray-300 hover:text-gray-900 hover:shadow-md active:scale-[0.97] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:shadow-black/10 dark:hover:border-gray-600 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <ProductDetails product={product} />
      </section>
    </main>
  );
}
