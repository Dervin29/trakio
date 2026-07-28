"use client";

import { useState } from "react";
import { addProduct } from "@/app/actions";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Link2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AddProductForm({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product tracked successfully!");
      setUrl("");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="animate-fade-in-up rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-lg shadow-gray-200/50 backdrop-blur-xl sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Link2 className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste product URL from any store..."
                className="h-12 w-full rounded-xl border-gray-200 bg-white pl-11 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15"
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl bg-gradient-to-r from-brand to-brand-dark px-8 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/30 active:scale-[0.98] disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                "Track Price"
              )}
            </Button>
          </div>
        </form>
        <p className="mt-3 text-xs text-gray-400">
          Supports Amazon, Flipkart, Myntra, and hundreds of online stores.
        </p>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
