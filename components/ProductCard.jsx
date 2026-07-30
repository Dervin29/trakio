"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  TrendingDown,
  TrendingUp,
  Target,
  AlertTriangle,
  ShoppingCart,
  ExternalLink,
  Clock,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteProduct } from "@/app/actions";
import { toast } from "sonner";
import { formatPrice } from "@/utils/currency";

function getStoreName(url) {
  try {
    return new URL(url).hostname.replace("www.", "").split(".")[0];
  } catch {
    return "Store";
  }
}

function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function ProductCard({ product, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const priceChange = product.price_change;
  const isDrop = priceChange !== null && priceChange < 0;
  const isIncrease = priceChange !== null && priceChange > 0;
  const isGoodDeal = priceChange !== null && priceChange <= -10;

  const prevPrice = priceChange !== null
    ? product.current_price / (1 + priceChange / 100)
    : null;
  const savings = prevPrice !== null && isDrop ? prevPrice - product.current_price : 0;

  const hasTarget = product.target_price != null && product.target_price > 0;
  const targetProgress = hasTarget
    ? Math.min(100, Math.max(0, (product.target_price / product.current_price) * 100))
    : 0;

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteProduct(product.id);
    setDeleting(false);

    if (result.success) {
      setDialogOpen(false);
      toast.success("Product removed");
      onDelete?.(product.id);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex h-full flex-col rounded-2xl bg-white dark:bg-gray-950 shadow-depth ring-1 ring-gray-200/80 dark:ring-gray-800 hover:ring-brand/30 dark:hover:ring-brand/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Image */}
      <div className="relative m-2.5 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
        <div className="relative aspect-[4/3]">
          {!imgError && product.image_url ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer" />
              )}
              <img
                src={product.image_url}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                  imgLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                } group-hover:scale-105`}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                <ShoppingCart className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              </div>
              <span className="text-xs font-medium text-gray-300 dark:text-gray-600">No image</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 via-transparent" />
        </div>

        {/* Store badge */}
        <div className="absolute left-2.5 top-2.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] px-2 py-1 font-medium text-gray-600 shadow-sm ring-1 ring-black/5 dark:bg-gray-900/90 dark:text-gray-400 dark:ring-white/10">
            <Store className="h-3 w-3" />
            {getStoreName(product.url)}
          </span>
        </div>

        {/* Price change badge */}
        {priceChange !== null && (
          <div className={`absolute right-2.5 top-2.5 rounded-md backdrop-blur-sm text-[10px] px-2 py-1 font-semibold shadow-sm ring-1 ${
            isDrop
              ? "bg-emerald-50/90 text-emerald-700 ring-emerald-200/50 dark:bg-emerald-900/80 dark:text-emerald-300 dark:ring-emerald-700/30"
              : isIncrease
              ? "bg-red-50/90 text-red-700 ring-red-200/50 dark:bg-red-900/80 dark:text-red-300 dark:ring-red-700/30"
              : "bg-gray-100/90 text-gray-600 ring-gray-200/50 dark:bg-gray-800/90 dark:text-gray-400 dark:ring-gray-700/30"
          }`}>
            <span className="inline-flex items-center gap-0.5">
              {isDrop && <TrendingDown className="h-3 w-3" />}
              {isIncrease && <TrendingUp className="h-3 w-3" />}
              {priceChange === 0 ? "0%" : `${isDrop ? "" : "+"}${priceChange.toFixed(1)}%`}
            </span>
          </div>
        )}

        {/* Best deal badge */}
        {isGoodDeal && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 text-[10px] px-2 py-1 font-semibold text-white shadow-sm">
              <TrendingDown className="h-3 w-3" />
              Best Deal
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4 pt-2">
        {/* Product name */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatPrice(product.current_price, product.currency)}
          </span>
          {prevPrice !== null && (
            <span className="text-xs line-through text-gray-400 dark:text-gray-500">
              {formatPrice(prevPrice, product.currency)}
            </span>
          )}
          {isDrop && savings > 0 && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              -{formatPrice(savings, product.currency)}
            </span>
          )}
        </div>

        {/* Target bar */}
        {hasTarget && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Target className="h-3 w-3 text-brand" />
                Target: {formatPrice(product.target_price, product.currency)}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {targetProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  targetProgress <= 30
                    ? "bg-emerald-500"
                    : targetProgress <= 60
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${targetProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
            <Clock className="h-3 w-3" />
            {getRelativeTime(product.updated_at || product.created_at)}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(product.url, "_blank", "noopener,noreferrer");
              }}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              title="Open in store"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger onClick={(e) => e.preventDefault()} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100 dark:bg-red-900/30 dark:ring-red-800/50">
                    <AlertTriangle className="h-7 w-7 text-red-500" />
                  </div>
                  <DialogTitle className="text-center text-lg">
                    Remove product?
                  </DialogTitle>
                  <DialogDescription className="text-center leading-relaxed">
                    Are you sure you want to remove{" "}
                    <span className="font-medium text-foreground">
                      {product.name}
                    </span>
                    ? This will delete all price history and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                    {product.image_url && !imgError ? (
                      <img
                        src={product.image_url}
                        alt=""
                        className="h-12 w-12 rounded-lg object-contain bg-white dark:bg-gray-900"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white dark:bg-gray-900">
                        <ShoppingCart className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 line-clamp-1 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatPrice(product.current_price, product.currency)}
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-2 gap-2">
                  <DialogClose render={<Button variant="outline" className="flex-1 rounded-xl" />}>
                    Cancel
                  </DialogClose>

                  <Button
                    variant="destructive"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="flex-1 rounded-xl"
                  >
                    {deleting ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Removing...
                      </span>
                    ) : (
                      "Remove"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </div>
    </Link>
  );
}
