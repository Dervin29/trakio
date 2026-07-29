"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Store,
  Clock,
  Target,
  Eye,
  AlertTriangle,
  Tag,
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
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImgLoaded(true);
    }
  }, []);

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
    <div className="group flex flex-col sm:flex-row overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
      {/* Image Section - Smaller on desktop */}
      <div className="relative w-full sm:w-48 md:w-56 lg:w-64 aspect-[4/3] sm:aspect-square shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {!imgError && product.image_url ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
            )}
            <img
              ref={imgRef}
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`h-full w-full object-contain p-4 transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <Store className="h-12 w-12 text-gray-300 dark:text-gray-700" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isGoodDeal && (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
              <Tag className="h-3 w-3" />
              Best Deal
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {getStoreName(product.url)}
              </span>
              {product.updated_at && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  · {getRelativeTime(product.updated_at)}
                </span>
              )}
            </div>
            <h3 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white leading-snug">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Price & Change - Horizontal layout */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.current_price, product.currency)}
            </span>
            {prevPrice !== null && (
              <span className="ml-2 text-sm text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(prevPrice, product.currency)}
              </span>
            )}
          </div>
          {priceChange !== null && (
            <span
              className={`inline-flex items-center gap-1 text-sm font-medium ${
                isDrop
                  ? "text-emerald-600 dark:text-emerald-400"
                  : isIncrease
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {isDrop ? (
                <TrendingDown className="h-4 w-4" />
              ) : isIncrease ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
              {priceChange === 0
                ? "0%"
                : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
            </span>
          )}
        </div>

        {/* Savings & Target */}
        <div className="flex flex-wrap items-center gap-3">
          {isDrop && savings > 0 && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Save {formatPrice(savings, product.currency)}
            </span>
          )}
          
          {hasTarget && (
            <div className="flex-1 min-w-[120px]">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Target className="h-3 w-3" />
                  Target
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {targetProgress.toFixed(0)}%
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-500"
                  style={{ width: `${targetProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pt-3 mt-auto border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open product"
          >
            <ExternalLink className="h-4 w-4" />
          </button>

          <Link
            href={`/products/${product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Eye className="h-4 w-4" />
            Details
          </Link>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button
                disabled={deleting}
                className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                aria-label="Delete product"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle className="text-center text-lg">
                  Remove product?
                </DialogTitle>
                <DialogDescription className="text-center">
                  Are you sure you want to remove "{product.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="flex-1"
                >
                  {deleting ? "Removing..." : "Remove"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}