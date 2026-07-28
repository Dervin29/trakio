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
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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

  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setImgLoaded(true);
    }
  }, []);

  const priceChange = product.price_change;

  const isDrop = priceChange !== null && priceChange < 0;

  const isGoodDeal = priceChange !== null && priceChange <= -10;

  async function handleDelete() {
    setDeleting(true);

    const result = await deleteProduct(product.id);

    setDeleting(false);

    if (result.success) {
      toast.success("Product removed");
      onDelete?.(product.id);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Card
      className="
        group overflow-hidden rounded-3xl
        border border-gray-200/70
        bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="flex p-3 gap-4">
        {/* IMAGE */}
        <div
          className="
            relative flex h-32 w-32 shrink-0
            items-center justify-center
            overflow-hidden rounded-2xl
            bg-gradient-to-br
            from-gray-50
            via-white
            to-brand-light
          "
        >
          {!imgError && product.image_url ? (
            <>
              {!imgLoaded && (
                <div
                  className="
                  absolute inset-0 animate-pulse bg-gray-100
                "
                />
              )}

              <img
                ref={imgRef}
                src={product.image_url}
                alt={product.name}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className="
                  h-full w-full object-contain
                  p-4
                  transition-transform duration-500
                  group-hover:scale-110
                "
              />
            </>
          ) : (
            <Store className="h-10 w-10 text-gray-300" />
          )}

          <Badge
            className="
              absolute left-2 top-2
              rounded-full
              bg-black/80
              px-2 py-0.5
              text-[10px]
              text-white
            "
          >
            <Activity className="mr-1 h-3 w-3" />
            Live
          </Badge>

          {isGoodDeal && (
            <Badge
              className="
                absolute bottom-2 left-2
                rounded-full
                bg-green-500
                px-2 py-0.5
                text-[10px]
              "
            >
              Best Deal
            </Badge>
          )}
        </div>

        {/* CONTENT */}
        <CardContent className="flex min-w-0 flex-1 flex-col p-0">
          {/* HEADER */}
          <div className="flex justify-between gap-2">
            <div className="min-w-0">
              <div
                className="
                flex items-center gap-2
                text-xs text-gray-400
              "
              >
                <Badge
                  variant="outline"
                  className="
                    rounded-full
                    px-2 py-0
                    text-[10px]
                    capitalize
                  "
                >
                  <Store className="mr-1 h-3 w-3" />
                  {getStoreName(product.url)}
                </Badge>

                {product.updated_at && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getRelativeTime(product.updated_at)}
                  </span>
                )}
              </div>

              <h3
                title={product.name}
                className="
                  mt-2
                  line-clamp-2
                  text-sm
                  font-semibold
                  leading-5
                "
              >
                {product.name}
              </h3>
            </div>

            <div className="flex gap-1">
              <button
                title="Open product"
                onClick={() =>
                  window.open(product.url, "_blank", "noopener,noreferrer")
                }
                className="
                  h-7 w-7
                  rounded-lg
                  text-gray-400
                  transition
                  hover:bg-brand-light
                  hover:text-brand
                "
              >
                <ExternalLink className="mx-auto h-4 w-4" />
              </button>

              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={deleting}
                      className="
                        h-7 w-7
                        rounded-lg
                        text-gray-400
                        hover:bg-red-50
                        hover:text-red-500
                      "
                    />
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center">Delete product?</DialogTitle>
                    <DialogDescription className="text-center">
                      Are you sure you want to remove{" "}
                      <span className="font-medium text-foreground">{product.name}</span>?
                      This cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose
                      render={<Button variant="outline" className="w-full sm:w-auto" />}
                    >
                      Cancel
                    </DialogClose>
                    <Button
                      variant="destructive"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="w-full sm:w-auto"
                    >
                      {deleting ? "Removing..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* PRICE */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p
                className="
                text-[10px]
                font-medium
                uppercase
                tracking-wider
                text-gray-400
              "
              >
                Current Price
              </p>

              <div className="flex items-center gap-2">
                <span
                  className="
                  text-2xl
                  font-bold
                  tracking-tight
                "
                >
                  {formatPrice(product.current_price, product.currency)}
                </span>

                {priceChange !== null && (
                  <Badge
                    className={`
                      rounded-full
                      border
                      px-2
                      text-[11px]

                      ${
                        isDrop
                          ? "border-green-200 bg-green-50 text-green-700"
                          : priceChange > 0
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-gray-200 bg-gray-100 text-gray-600"
                      }
                    `}
                  >
                    {isDrop ? (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    ) : priceChange > 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <Minus className="mr-1 h-3 w-3" />
                    )}

                    {priceChange === 0
                      ? "0%"
                      : `${priceChange > 0 ? "+" : ""}
                    ${priceChange.toFixed(1)}%`}
                  </Badge>
                )}
              </div>
            </div>

            {product.target_price && (
              <div
                className="
                  rounded-xl
                  bg-brand-light
                  px-3 py-2
                "
              >
                <p
                  className="
                  flex items-center gap-1
                  text-[10px]
                  text-brand
                "
                >
                  <Target className="h-3 w-3" />
                  Target
                </p>

                <p
                  className="
                  text-xs
                  font-semibold
                  text-brand-700
                "
                >
                  {formatPrice(product.target_price, product.currency)}
                </p>
              </div>
            )}
          </div>

          {/* ACTION */}
          <Button
            asChild
            size="sm"
            className="
              mt-4
              h-9
              rounded-xl
              text-xs
            "
          >
            <Link
              href={`/products/${product.id}`}
              className="
                flex items-center
                justify-center
                gap-2
              "
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
