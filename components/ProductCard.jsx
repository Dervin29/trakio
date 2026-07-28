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
  Activity,
  Eye,
  AlertTriangle,
  ArrowRight,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

  const prevPrice =
    priceChange !== null
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
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 via-white to-brand-light/40">
        {!imgError && product.image_url ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            )}
            <img
              ref={imgRef}
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`h-full w-full object-contain p-6 transition-all duration-700 group-hover:scale-110 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Store className="h-8 w-8 text-gray-300" />
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
            <Activity className="h-3 w-3" />
            Live
          </span>
          {isGoodDeal && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
              <Tag className="h-3 w-3" />
              Best Deal
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Product Header */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              <Store className="h-2.5 w-2.5" />
              {getStoreName(product.url)}
            </span>
            {product.updated_at && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                <Clock className="h-3 w-3" />
                {getRelativeTime(product.updated_at)}
              </span>
            )}
          </div>
          <h3
            title={product.name}
            className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900"
          >
            {product.name}
          </h3>
        </div>

        {/* Price Display */}
        <div className="rounded-xl bg-gray-50/80 p-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                Current Price
              </p>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                {formatPrice(product.current_price, product.currency)}
              </span>
              {prevPrice !== null && (
                <div className="mt-0.5">
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(prevPrice, product.currency)}
                  </span>
                </div>
              )}
            </div>
            {priceChange !== null && (
              <div className="flex flex-col items-end gap-0.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    isDrop
                      ? "bg-emerald-50 text-emerald-700"
                      : isIncrease
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isDrop ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : isIncrease ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                  {priceChange === 0
                    ? "0%"
                    : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
                </span>
                {isDrop && savings > 0 && (
                  <span className="text-[10px] font-medium text-emerald-600">
                    Save {formatPrice(savings, product.currency)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Target Price */}
        {hasTarget && (
          <div className="rounded-xl bg-brand-light/40 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-700">
                <Target className="h-3.5 w-3.5" />
                Target:{" "}
                <span className="font-semibold">
                  {formatPrice(product.target_price, product.currency)}
                </span>
              </span>
              <span className="text-[11px] font-semibold text-brand">
                {targetProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-300/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-500"
                style={{ width: `${targetProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-gray-400">
              {targetProgress >= 100
                ? "Target reached!"
                : `${(100 - targetProgress).toFixed(0)}% away from target`}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            title="Open product in new tab"
            onClick={() =>
              window.open(product.url, "_blank", "noopener,noreferrer")
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-brand-light hover:text-brand"
          >
            <ExternalLink className="h-4 w-4" />
          </button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <button
                  disabled={deleting}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              }
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
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
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-2 gap-2">
                <DialogClose
                  render={
                    <Button variant="outline" className="flex-1 rounded-xl" />
                  }
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

        {/* Primary CTA */}
        <div className="mt-auto">
          <Link
            href={`/products/${product.id}`}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
          >
            <Eye className="h-4 w-4" />
            View Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
