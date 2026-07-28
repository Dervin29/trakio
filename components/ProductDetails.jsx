"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Store,
  Clock,
  Target,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
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
import PriceChart from "./PriceCharts";
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

function getInsight(product, priceChange) {
  const isDrop = priceChange < 0;
  const isIncrease = priceChange > 0;
  const isGoodDeal = priceChange <= -10;
  const hasTarget = product.target_price > 0;
  const targetReached = hasTarget && product.current_price <= product.target_price;

  if (isGoodDeal) {
    return {
      icon: TrendingDown,
      title: "Excellent time to buy",
      description: "Significant price drop detected.",
      color: "emerald",
    };
  }
  if (targetReached) {
    return {
      icon: Target,
      title: "Target reached!",
      description: "Current price matches your target.",
      color: "brand",
    };
  }
  if (isDrop) {
    return {
      icon: TrendingDown,
      title: "Price dropped",
      description: `Decreased by ${Math.abs(priceChange).toFixed(1)}%.`,
      color: "emerald",
    };
  }
  if (isIncrease) {
    return {
      icon: TrendingUp,
      title: "Price increased",
      description: `Rose by ${priceChange.toFixed(1)}%.`,
      color: "amber",
    };
  }
  return {
    icon: Minus,
    title: "Price stable",
    description: "No significant change.",
    color: "gray",
  };
}

export default function ProductDetails({ product }) {
  const router = useRouter();
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

  const prevPrice = priceChange !== null
    ? product.current_price / (1 + priceChange / 100)
    : null;
  const savings = prevPrice !== null && isDrop ? prevPrice - product.current_price : 0;

  const hasTarget = product.target_price != null && product.target_price > 0;
  const targetProgress = hasTarget
    ? Math.min(100, Math.max(0, (product.target_price / product.current_price) * 100))
    : 0;

  const insight = getInsight(product, priceChange);

  const insightColors = {
    emerald: "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
    brand: "border-brand bg-brand-light text-brand-700 dark:bg-brand-950/30 dark:text-brand-300",
    amber: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    gray: "border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteProduct(product.id);
    setDeleting(false);
    if (result.success) {
      setDialogOpen(false);
      toast.success("Product removed");
      router.push("/products");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <div className="relative aspect-square bg-gray-50 dark:bg-gray-900">
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
                    className={`h-full w-full object-contain p-4 transition-opacity ${
                      imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-700" />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-3">
              Actions
            </h3>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Store
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full justify-start">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Product
                  </Button>
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

          {/* Status */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-3">
              Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Store</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {getStoreName(product.url)}
                </span>
              </div>
              {product.updated_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last checked</span>
                  <span className="text-gray-900 dark:text-white">
                    {getRelativeTime(product.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-3">
          {/* Title */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.current_price, product.currency)}
                </div>
                {prevPrice !== null && (
                  <div className="mt-1 text-sm text-gray-400 dark:text-gray-500 line-through">
                    {formatPrice(prevPrice, product.currency)}
                  </div>
                )}
              </div>
              {priceChange !== null && (
                <div
                  className={`text-sm font-medium ${
                    isDrop
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isIncrease
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {isDrop ? (
                    <TrendingDown className="inline h-4 w-4 mr-1" />
                  ) : isIncrease ? (
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                  ) : (
                    <Minus className="inline h-4 w-4 mr-1" />
                  )}
                  {priceChange === 0
                    ? "0%"
                    : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
                </div>
              )}
            </div>
            {isDrop && savings > 0 && (
              <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                Save {formatPrice(savings, product.currency)}
              </p>
            )}
          </div>

          {/* Insight */}
          <div
            className={`rounded-lg border-l-4 p-4 ${insightColors[insight.color]}`}
          >
            <div className="flex items-start gap-3">
              <insight.icon className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-medium">{insight.title}</h3>
                <p className="text-sm opacity-80">{insight.description}</p>
              </div>
            </div>
          </div>

          {/* Target */}
          {hasTarget && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Target className="h-4 w-4 text-brand" />
                  Target Price
                </h3>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.target_price, product.currency)}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {targetProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${targetProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {targetProgress >= 100
                    ? "Target reached! 🎉"
                    : `${(100 - targetProgress).toFixed(0)}% away from target`}
                </p>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:dark:bg-gray-950">
            <PriceChart productId={product.id} currency={product.currency} />
          </div>
        </div>
      </div>
    </div>
  );
}