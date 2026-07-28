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
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions";
import { toast } from "sonner";
import PriceChart from "./PriceCharts";
import Link from "next/link";

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

export default function ProductDetails({ product }) {
  const router = useRouter();

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
      router.push("/products");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden">
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
                    className="h-full w-full object-contain p-8 transition duration-500 hover:scale-105"
                  />
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  <ShoppingCart className="h-20 w-20" />
                </div>
              )}
            </div>

            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge className="border-0 bg-emerald-500 text-white px-3 py-1.5">
                <Activity className="mr-1.5 h-3.5 w-3.5" />
                Tracking
              </Badge>

              {isGoodDeal && (
                <Badge className="border-0 bg-brand text-white px-3 py-1.5">
                  Deal
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="rounded-full capitalize text-sm px-4 py-1.5"
                >
                  <Store className="mr-1.5 h-4 w-4" />
                  {getStoreName(product.url)}
                </Badge>

                {product.updated_at && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {getRelativeTime(product.updated_at)}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-500 mb-1">
                    Current Price
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-bold">
                    {formatPrice(product.current_price, product.currency)}
                  </h2>
                </div>

                {priceChange !== null && (
                  <Badge
                    className={`text-sm px-4 py-1.5 ${
                      priceChange < 0
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : priceChange > 0
                          ? "border border-red-200 bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {priceChange < 0 ? (
                      <TrendingDown className="mr-1.5 h-4 w-4" />
                    ) : priceChange > 0 ? (
                      <TrendingUp className="mr-1.5 h-4 w-4" />
                    ) : (
                      <Minus className="mr-1.5 h-4 w-4" />
                    )}

                    {priceChange === 0
                      ? "0%"
                      : `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%`}
                  </Badge>
                )}
              </div>

              {product.target_price && (
                <div className="flex items-center justify-between rounded-xl bg-brand-light px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-brand" />
                    <span className="text-sm text-gray-600">Target Price</span>
                  </div>
                  <span className="font-semibold text-lg">
                    {formatPrice(product.target_price, product.currency)}
                  </span>
                </div>
              )}

              {isGoodDeal && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                  <TrendingDown className="mr-2 inline h-4 w-4" />
                  Significant price drop detected
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                className="flex-1 rounded-xl h-12 text-base"
                onClick={() =>
                  window.open(product.url, "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Visit Store
              </Button>

              <Button
                variant="destructive"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-xl h-12"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                {deleting ? "Removing..." : "Remove Product"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <PriceChart productId={product.id} currency={product.currency} />
        </CardContent>
      </Card>
    </div>
  );
}
