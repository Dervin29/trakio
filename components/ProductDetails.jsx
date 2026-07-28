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
  Activity,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Zap,
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
      description: "Significant price drop detected. Consider purchasing now.",
      color: "emerald",
      bg: "bg-emerald-50/60",
      border: "border-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    };
  }
  if (targetReached) {
    return {
      icon: Target,
      title: "Target reached!",
      description: "Current price matches or beats your target price.",
      color: "brand",
      bg: "bg-brand-light/60",
      border: "border-brand-300/40",
      text: "text-brand-700",
      iconBg: "bg-brand-light",
    };
  }
  if (isDrop) {
    return {
      icon: TrendingDown,
      title: "Price dropped",
      description: `Price decreased by ${Math.abs(priceChange).toFixed(1)}% from the last check.`,
      color: "emerald",
      bg: "bg-emerald-50/40",
      border: "border-emerald-200/50",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    };
  }
  if (isIncrease) {
    return {
      icon: TrendingUp,
      title: "Price increased",
      description: `Price rose by ${priceChange.toFixed(1)}%. Consider waiting for a drop.`,
      color: "amber",
      bg: "bg-amber-50/40",
      border: "border-amber-200/50",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    };
  }
  return {
    icon: Minus,
    title: "Price stable",
    description: "No significant price change since last check.",
    color: "gray",
    bg: "bg-gray-50/40",
    border: "border-gray-200/50",
    text: "text-gray-600",
    iconBg: "bg-gray-100",
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
  const targetGap = hasTarget
    ? Math.max(0, product.current_price - product.target_price)
    : 0;

  const insight = getInsight(product, priceChange);

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
    <div className="animate-fade-in space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column - Image & Actions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-sm">
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-brand-light/30">
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
                    className={`h-full w-full object-contain p-8 transition-all duration-700 group-hover:scale-110 ${
                      imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gray-100">
                    <ShoppingCart className="h-12 w-12 text-gray-300" />
                  </div>
                </div>
              )}

              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                  <Activity className="h-3.5 w-3.5" />
                  Live Tracking
                </span>
                {isGoodDeal && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                    <TrendingDown className="h-3.5 w-3.5" />
                    Best Deal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <Button
                className="h-11 w-full justify-start rounded-xl text-sm font-medium"
                onClick={() =>
                  window.open(product.url, "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Store
                <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="destructive"
                      disabled={deleting}
                      className="h-11 w-full justify-start rounded-xl text-sm font-medium"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Product
                    </Button>
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
                      ? This will delete all price history and cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                      {product.image_url && !imgError ? (
                        <img
                          src={product.image_url}
                          alt=""
                          className="h-12 w-12 rounded-lg object-contain bg-white"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                          <ShoppingCart className="h-6 w-6 text-gray-300" />
                        </div>
                      )}
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(product.current_price, product.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
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
          </div>

          {/* Tracking Status */}
          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Tracking Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Status
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <Store className="h-4 w-4" />
                  Store
                </span>
                <span className="text-sm font-medium capitalize text-gray-900">
                  {getStoreName(product.url)}
                </span>
              </div>
              {product.updated_at && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Last Checked
                  </span>
                  <span className="text-sm text-gray-900">
                    {getRelativeTime(product.updated_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Info, Pricing, Insights, Chart */}
        <div className="space-y-6 lg:col-span-3">
          {/* Title & Store */}
          <div className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-500">
                <Store className="h-3.5 w-3.5" />
                {getStoreName(product.url)}
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Current Price
            </p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  {formatPrice(product.current_price, product.currency)}
                </span>
                {prevPrice !== null && (
                  <div className="mt-1">
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(prevPrice, product.currency)}
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-sm text-gray-500">
                      {isDrop
                        ? `Down ${formatPrice(savings, product.currency)}`
                        : isIncrease
                          ? `Up ${formatPrice(prevPrice - product.current_price, product.currency)}`
                          : "No change"}
                    </span>
                  </div>
                )}
              </div>
              {priceChange !== null && (
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                      isDrop
                        ? "bg-emerald-50 text-emerald-700"
                        : isIncrease
                          ? "bg-red-50 text-red-600"
                          : "bg-gray-100 text-gray-500"
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
                  <span className="text-xs text-gray-400">
                    {isDrop ? "Price Dropped" : isIncrease ? "Price Increased" : "No Change"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div
            className={`rounded-2xl border-l-4 ${insight.border} ${insight.bg} ${insight.text} p-5 shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${insight.iconBg}`}>
                <insight.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{insight.title}</h3>
                <p className="mt-0.5 text-sm opacity-80">{insight.description}</p>
              </div>
            </div>
          </div>

          {/* Target Price */}
          {hasTarget && (
            <div className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Target className="h-4 w-4 text-brand" />
                  Target Price
                </h3>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.target_price, product.currency)}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="mt-0.5 font-semibold text-gray-900">
                    {formatPrice(product.current_price, product.currency)}
                  </p>
                </div>
                <div className="rounded-xl bg-brand-light/40 p-3">
                  <p className="text-xs text-gray-500">Target</p>
                  <p className="mt-0.5 font-semibold text-brand-700">
                    {formatPrice(product.target_price, product.currency)}
                  </p>
                </div>
              </div>
              {targetGap > 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  <span className="font-medium text-brand">
                    {formatPrice(targetGap, product.currency)}
                  </span>{" "}
                  away from your target
                </p>
              )}
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-medium text-brand">
                    {targetProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-300/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-brand-dark transition-all duration-700"
                    style={{ width: `${targetProgress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  {targetProgress >= 100
                    ? "Target reached! 🎉"
                    : `${(100 - targetProgress).toFixed(0)}% of the way to your target`}
                </p>
              </div>
            </div>
          )}

          {/* Price Chart */}
          <div className="rounded-2xl border border-gray-200/50 bg-white p-6 shadow-sm sm:p-8">
            <PriceChart productId={product.id} currency={product.currency} />
          </div>
        </div>
      </div>
    </div>
  );
}
