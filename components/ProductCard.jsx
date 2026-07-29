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
  DollarSign,
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
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md dark:shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Image Section - Fixed aspect ratio with proper containment */}
      <div className="relative w-full bg-muted/50 dark:bg-muted/30" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0 p-3">
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
            {!imgError && product.image_url ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-muted to-muted/50 dark:from-muted/50 dark:to-muted animate-pulse" />
                )}
                <img
                  ref={imgRef}
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  className={`h-full w-full object-contain transition-all duration-500 ${
                    imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  } group-hover:scale-105`}
                />
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Store className="h-16 w-16 text-muted-foreground/50 dark:text-muted-foreground/40" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1.5">
              {isGoodDeal && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-success-foreground shadow-lg shadow-success/30">
                  <Tag className="h-3 w-3" />
                  Best Deal
                </span>
              )}
            </div>

            {/* Price Change Badge on Image */}
            {priceChange !== null && (
              <div className="absolute bottom-2 right-2 rounded-full bg-popover/95 backdrop-blur-sm px-2.5 py-1 shadow-lg">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    isDrop
                      ? "text-success dark:text-success-foreground"
                      : isIncrease
                      ? "text-destructive dark:text-destructive-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {isDrop ? (
                    <TrendingDown className="h-3.5 w-3.5" />
                  ) : isIncrease ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                  {priceChange === 0
                    ? "0%"
                    : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground uppercase">
              <Store className="h-3 w-3" />
              {getStoreName(product.url)}
            </span>
            {product.updated_at && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {getRelativeTime(product.updated_at)}
              </span>
            )}
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between border-t border-border/60 pt-2.5 dark:border-border/60">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground tracking-tight">
              {formatPrice(product.current_price, product.currency)}
            </span>
            {prevPrice !== null && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(prevPrice, product.currency)}
              </span>
            )}
          </div>
          {isDrop && savings > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success dark:bg-success/20">
              <DollarSign className="h-3 w-3" />
              Save {formatPrice(savings, product.currency)}
            </span>
          )}
        </div>

        {/* Target Progress */}
        {hasTarget && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Target className="h-3.5 w-3.5" />
                Target: {formatPrice(product.target_price, product.currency)}
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {targetProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-muted/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  targetProgress <= 30
                    ? "bg-success"
                    : targetProgress <= 60
                    ? "bg-warning"
                    : "bg-brand"
                }`}
                style={{ width: `${targetProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center gap-1 pt-2.5 border-t border-border/60 dark:border-border/60">
          <button
            onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
            aria-label="Open product"
          >
            <ExternalLink className="h-4 w-4" />
          </button>

          <Link
            href={`/products/${product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
            <span>Details</span>
          </Link>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-all duration-200"
              aria-label="Delete product"
            >
              <Trash2 className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/30">
                  <AlertTriangle className="h-6 w-6 text-destructive dark:text-destructive-foreground" />
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
  );
}