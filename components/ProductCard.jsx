"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Store,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions";
import { toast } from "sonner";
import PriceChart from "./PriceCharts";

function formatPrice(price, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 2,
  }).format(price);
}

function getStoreName(url) {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return hostname.split(".")[0];
  } catch {
    return "Store";
  }
}

function getRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProductCard({ product, onDelete }) {
  const router = useRouter();
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImgLoaded(true);
    }
  }, []);

  const priceChange = product.price_change;
  const isGoodDeal = priceChange !== null && priceChange < -10;

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteProduct(product.id);
    setDeleting(false);

    if (result.success) {
      toast.success(`${product.name} removed from tracking`);
      if (onDelete) onDelete(product.id);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to remove product");
    }
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <div className="aspect-square bg-gray-50">
          {!imgError && product.image_url ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-100" />
              )}
              <img
                ref={imgRef}
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <Store className="h-14 w-14" />
            </div>
          )}
        </div>

        {isGoodDeal && (
          <div className="absolute left-3 top-3">
            <Badge className="border-0 bg-green-500 text-white shadow-sm">
              <TrendingDown className="mr-0.5 h-3 w-3" />
              {Math.abs(priceChange).toFixed(0)}%
            </Badge>
          </div>
        )}

        <Button
          variant="secondary"
          size="icon"
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${product.name}`}
          className="absolute right-3 top-3 h-9 w-9 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className="shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize"
          >
            <Store className="mr-1 h-3 w-3" />
            {getStoreName(product.url)}
          </Badge>
          {product.updated_at && (
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-gray-400">
              <Clock className="h-3 w-3" />
              {getRelativeTime(product.updated_at)}
            </span>
          )}
        </div>

        <h3
          className="line-clamp-2 text-[15px] font-semibold leading-6 text-gray-900"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="text-2xl font-bold tracking-tight text-gray-900">
            {formatPrice(product.current_price, product.currency)}
          </p>

          {priceChange !== null && (
            <Badge
              className={`shrink-0 gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                priceChange < 0
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : priceChange > 0
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-gray-200 bg-gray-100 text-gray-600"
              }`}
            >
              {priceChange < 0 ? (
                <TrendingDown className="h-3.5 w-3.5" />
              ) : priceChange > 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              {priceChange === 0
                ? "No Change"
                : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
            </Badge>
          )}
        </div>

        {isGoodDeal && (
          <p className="mt-1.5 text-sm font-medium text-green-600">
            Great deal &mdash; price dropped significantly
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
            aria-label={`View ${product.name} on store`}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View
          </Button>

          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={() => setShowChart(!showChart)}
            aria-label={showChart ? "Hide price chart" : "Show price chart"}
          >
            {showChart ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Chart
              </>
            )}
          </Button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showChart ? "mt-5 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-100 pt-5">
            <PriceChart productId={product.id} currency={product.currency} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
