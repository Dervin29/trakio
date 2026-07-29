"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  TrendingDown,
  Target,
  AlertTriangle,
  ShoppingCart,
  ExternalLink,
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
  const savingsPercent = prevPrice !== null && isDrop
    ? ((savings / prevPrice) * 100).toFixed(0)
    : null;

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
    <div className="group relative flex h-full flex-col rounded-2xl bg-gradient-to-b from-white to-gray-50 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 will-change-transform ring-1 ring-black/5 dark:from-gray-900 dark:to-gray-950 dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] dark:ring-white/5">

      {/* Image Section */}
      <div className="m-3 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="relative aspect-[1/1]">
          {!imgError && product.image_url ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer" />
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
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-200/50 dark:bg-gray-700/50">
                <svg className="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-300 dark:text-gray-600">No image</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/20 via-transparent" />
        </div>

        {/* Store Badge */}
        <div className="absolute left-2.5 top-2.5">
          <span className="inline-flex items-center rounded-md bg-white/90 backdrop-blur-sm text-[11px] px-2 py-1 font-medium text-gray-700 shadow-sm ring-1 ring-black/5 dark:bg-gray-900/90 dark:text-gray-300 dark:ring-white/10">
            {getStoreName(product.url)}
          </span>
        </div>

        {/* Price Change Badge */}
        {priceChange !== null && (
          <div className="absolute right-2.5 top-2.5 rounded-md bg-white/90 backdrop-blur-sm text-[11px] px-2 py-1 shadow-sm ring-1 ring-black/5 dark:bg-gray-900/90 dark:ring-white/10">
            <span
              className={
                `inline-flex items-center gap-1 font-bold ${
                  isDrop
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isIncrease
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }`
              }
            >
              {isDrop && <TrendingDown className="h-3 w-3" />}
              {priceChange === 0
                ? "0%"
                : `${isDrop ? "" : isIncrease ? "+" : ""}${priceChange.toFixed(1)}%`}
            </span>
          </div>
        )}

        {/* Best Deal Badge */}
        {isGoodDeal && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 text-[11px] px-2 py-1 font-semibold text-white shadow-sm ring-1 ring-emerald-600/20">
              Best Deal
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-4 p-5 pt-4">

        {/* Product Name */}
        <Link href={`/products/${product.id}`} className="group/title">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover/title:text-brand transition-colors dark:text-gray-100 dark:group-hover/title:text-brand">
            {product.name}
          </h3>
        </Link>

        {/* Price + Savings */}
        <div className="space-y-2">
          <div>
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {formatPrice(product.current_price, product.currency)}
            </span>
          </div>
          {prevPrice !== null && (
            <>
              <div>
                <span className="text-sm line-through opacity-50 text-gray-400 dark:text-gray-500">
                  {formatPrice(prevPrice, product.currency)}
                </span>
              </div>
              {isDrop && savings > 0 && (
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full text-emerald-700">
                    Save {formatPrice(savings, product.currency)} ({savingsPercent}%)
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-500 uppercase tracking-wide">
          <span>{getRelativeTime(product.updated_at || product.created_at)}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <Link href={`/products/${product.id}`} className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            Details
          </Link>
        </div>

        {/* Target Progress */}
        {hasTarget && (
          <div className="rounded-xl bg-gray-50 p-3 space-y-2 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Target className="h-4 w-4 text-brand" />
                Target Price
              </div>
              <div className="text-xs text-gray-500">{targetProgress.toFixed(0)}%</div>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(product.target_price, product.currency)}</div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
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
            <div className="text-[11px] text-gray-400 dark:text-gray-500">
              {targetProgress <= 30 ? "Close to target" : targetProgress <= 60 ? "Getting closer" : "Still far from target"}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 pt-4 space-y-3">
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            View Details
          </Link>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Store
            </button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors dark:text-gray-400 dark:hover:text-red-400">
                <span className="inline-flex items-center gap-1"><Trash2 className="h-3.5 w-3.5" /> Delete</span>
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
                  <DialogClose
                    render={<Button variant="outline" className="flex-1 rounded-xl" />}
                  >
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
    </div>
  );
}
