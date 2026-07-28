"use client";

import { useState } from "react";
import { addProduct } from "@/app/actions";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
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
      toast.success(result.message || "Product added successfully");
      setUrl("");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any product URL..."
                className="h-12 pl-9 border-0 bg-white shadow-sm dark:bg-gray-800 focus:ring-2 focus:ring-brand"
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !url}
              className="h-12 px-8 bg-brand hover:bg-brand-dark text-white font-medium shadow-sm hover:shadow transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                "Start Tracking"
              )}
            </Button>
          </div>
        </form>
        <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
          Works with Amazon, Flipkart, Myntra, and hundreds of online stores
        </p>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}