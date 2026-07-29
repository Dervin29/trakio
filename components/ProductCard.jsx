"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  TrendingDown,
  Target,
  AlertTriangle,
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
    <div className="group relative flex h-full flex-col rounded-2xl bg-gradient-to-b from-white to-zinc-50 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 will-change-transform ring-1 ring-black/5 dark:from-zinc-900 dark:to-zinc-950 dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] dark:ring-white/5">

      {/* Image Section - make the image the visual hero */}
      <div className="relative m-3 overflow-hidden rounded-2xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
        <div className="aspect-[1/1]">
          {!imgError && product.image_url ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-linear-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 animate-shimmer" />
              )}
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                onLoadingComplete={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`object-cover transition-all duration-500 ${
                  imgLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
                } group-hover:scale-105`}
              />
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-200/50 dark:bg-zinc-700/50">
                <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-300 dark:text-zinc-600">No image</span>
            </div>
          )}

          {/* Gradient overlay for depth */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/20 via-transparent" />
        </div>

        {/* Store Badge - Top Left (small) */}
        <div className="absolute left-2.5 top-2.5">
          <span className="inline-flex items-center rounded-md bg-white/90 backdrop-blur-sm text-[11px] px-2 py-1 font-medium text-zinc-700 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900/90 dark:text-zinc-300 dark:ring-white/10">
            {getStoreName(product.url)}
          </span>
        </div>

        {/* Price Change Badge - Top Right (small with icon) */}
        {priceChange !== null && (
          <div className="absolute right-2.5 top-2.5 rounded-md bg-white/90 backdrop-blur-sm text-[11px] px-2 py-1 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900/90 dark:ring-white/10">
            <span
              className={
                `inline-flex items-center gap-1 font-bold ${
                  isDrop
                    ? "text-emerald-600 dark:text-emerald-400"
                    : isIncrease
                    ? "text-red-600 dark:text-red-400"
                    : "text-zinc-500 dark:text-zinc-400"
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

        {/* Best Deal Badge - Bottom (small) */}
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
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900 group-hover/title:text-brand transition-colors dark:text-zinc-100 dark:group-hover/title:text-brand">
            {product.name}
          </h3>
        </Link>

        {/* Price + Savings (price emphasized, savings below) */}
        <div className="space-y-2">
          <div>
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {formatPrice(product.current_price, product.currency)}
            </span>
          </div>
          {prevPrice !== null && (
            <>
              <div>
                <span className="text-sm line-through opacity-50 text-zinc-400 dark:text-zinc-500">
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
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wide">
          <span>{getRelativeTime(product.updated_at || product.created_at)}</span>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <Link href={`/products/${product.id}`} className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            Details
          </Link>
        </div>

        {/* Target Progress - compact card */}
        {hasTarget && (
          <div className="rounded-xl bg-zinc-50 p-3 space-y-2 dark:bg-zinc-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">🎯 Target Price</div>
              <div className="text-xs text-zinc-500">{targetProgress.toFixed(0)}%</div>
            </div>
            <div className="text-lg font-bold">{formatPrice(product.target_price, product.currency)}</div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
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
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {targetProgress <= 30 ? "Close to target" : targetProgress <= 60 ? "Getting closer" : "Still far from target"}
            </div>
          </div>
        )}

        {/* Actions: primary full-width button, then subtle small actions */}
        <div className="mt-5 pt-4 space-y-3">
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            View Details
          </Link>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Open Store
            </button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className="text-xs font-medium text-zinc-500 hover:text-red-600 transition-colors dark:text-zinc-400 dark:hover:text-red-400">
                <span className="inline-flex items-center gap-2"><Trash2 className="h-3.5 w-3.5" /> Delete</span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
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
                  <DialogClose
                    render={<Button variant="outline" className="flex-1" />}
                  >
                    Cancel
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
    </div>
  );
}
