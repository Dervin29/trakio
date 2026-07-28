import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { createClient } from "@/utils/supabase/server";
import { getProducts } from "@/app/actions";
import { ArrowLeft, Package, TrendingUp, Bell } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-light/20">
      <Header user={user} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Tracked Products
              </h1>
              <p className="text-gray-500 mt-1.5 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Monitor prices and get notified when they drop
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-gray-200/50 shadow-sm">
              <TrendingUp className="w-5 h-5 text-brand" />
              <span className="text-sm font-medium text-gray-700">
                <span className="text-gray-900 font-semibold">{total}</span>{" "}
                {total === 1 ? "product" : "products"} tracked
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination page={page} totalPages={totalPages} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 sm:py-28">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-light/80 to-brand-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-300/50">
              <Package className="w-12 h-12 text-brand" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No products tracked yet
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Start tracking your first product by adding a URL from your favorite online store.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-brand-dark text-white px-8 py-3.5 rounded-2xl font-medium hover:from-brand-dark hover:to-brand-700 transition-all duration-200 shadow-lg shadow-brand/30 hover:shadow-brand/40 transform hover:-translate-y-0.5"
            >
              <span>Add Your First Product</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}