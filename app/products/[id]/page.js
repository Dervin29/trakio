import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import ProductDetails from "@/components/ProductDetails";
import { createClient } from "@/utils/supabase/server";
import { getProduct } from "@/app/actions";
import { ArrowLeft } from "lucide-react";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-light/30">
      <Header user={user} />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <ProductDetails product={product} />
      </section>
    </main>
  );
}
