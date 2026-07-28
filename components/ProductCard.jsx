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
  Target,
  Activity,
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

  async function handleDelete() {
    setDeleting(true);

    const result = await deleteProduct(product.id);

    setDeleting(false);

    if (result.success) {
      toast.success("Product removed");

      onDelete?.(product.id);

      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
      {/* IMAGE */}

      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-b from-gray-50 to-white">
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
                className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <Store className="h-14 w-14" />
            </div>
          )}
        </div>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <Badge className="border-0 bg-green-500 text-white">
            <Activity className="mr-1 h-3 w-3" />
            Tracking
          </Badge>

          {isGoodDeal && (
            <Badge className="border-0 bg-orange-500 text-white">Deal</Badge>
          )}
        </div>

        <Button
          size="icon"
          variant="secondary"
          disabled={deleting}
          onClick={handleDelete}
          className="absolute right-3 top-3 h-9 w-9 rounded-full opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="space-y-5 p-5">
        {/* STORE */}

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="rounded-full capitalize">
            <Store className="mr-1 h-3 w-3" />
            {getStoreName(product.url)}
          </Badge>

          {product.updated_at && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {getRelativeTime(product.updated_at)}
            </span>
          )}
        </div>

        {/* TITLE */}

        <h3
          className="line-clamp-2 text-base font-semibold leading-6"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* PRICE */}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Current Price
            </p>

            <h2 className="text-3xl font-bold">
              {formatPrice(product.current_price, product.currency)}
            </h2>
          </div>

          {priceChange !== null && (
            <Badge
              className={
                priceChange < 0
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : priceChange > 0
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-gray-100 text-gray-600"
              }
            >
              {priceChange < 0 ? (
                <TrendingDown className="mr-1 h-3 w-3" />
              ) : priceChange > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <Minus className="mr-1 h-3 w-3" />
              )}

              {priceChange === 0
                ? "0%"
                : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
            </Badge>
          )}
        </div>

        {/* TARGET */}

        {product.target_price && (
          <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />

              <span className="text-sm text-gray-600">Target Price</span>
            </div>

            <span className="font-semibold">
              {formatPrice(product.target_price, product.currency)}
            </span>
          </div>
        )}

        {isGoodDeal && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            🎉 Great deal! This product dropped significantly.
          </div>
        )}

        {/* ACTIONS */}

        <div className="grid grid-cols-2 gap-3">
          <Button
            className="rounded-xl"
            onClick={() =>
              window.open(product.url, "_blank", "noopener,noreferrer")
            }
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Product
          </Button>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setShowChart((v) => !v)}
          >
            {showChart ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Price Chart
              </>
            )}
          </Button>
        </div>

        {/* CHART */}

        <div
          className={`overflow-hidden transition-all duration-500 ${
            showChart ? "max-h-[450px] opacity-100 pt-5" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t pt-5">
            <PriceChart productId={product.id} currency={product.currency} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
