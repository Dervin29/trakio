"use client";

import { useEffect, useId, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import { getPriceHistory } from "@/app/actions";

import { formatPrice } from "@/utils/currency";

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border bg-white px-4 py-3 shadow-xl">
      <p className="mb-1 text-xs text-gray-400">{label}</p>

      <p className="font-bold text-gray-900">
        {formatPrice(payload[0].value, currency)}
      </p>
    </div>
  );
}

export default function PriceChart({ productId, currency = "INR" }) {
  const gradientId = useId();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);

        const history = await getPriceHistory(productId);

        const chartData = history
          .sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at))
          .map((item) => ({
            date: new Date(item.checked_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),

            price: Number(item.price),
          }));

        setData(chartData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading price history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-center text-sm text-red-600">
        Unable to load price history.
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-10 text-center">
        <History className="mb-3 h-10 w-10 text-gray-300" />

        <p className="font-medium text-gray-700">No price history yet</p>

        <p className="mt-1 text-xs text-gray-400">
          Data will appear after the next price check.
        </p>
      </div>
    );
  }

  const firstPrice = data[0].price;
  const currentPrice = data.at(-1).price;

  const highest = Math.max(...data.map((item) => item.price));

  const lowest = Math.min(...data.map((item) => item.price));

  const change = ((currentPrice - firstPrice) / firstPrice) * 100;

  const priceDropped = change < 0;

  return (
    <div className="space-y-5">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <History className="h-4 w-4 text-orange-500" />
            Price History
          </h4>

          <p className="text-xs text-gray-400">{data.length} price checks</p>
        </div>

        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            priceDropped
              ? "text-green-600"
              : change > 0
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {priceDropped ? (
            <TrendingDown className="h-4 w-4" />
          ) : change > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}%
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Current</p>

          <p className="mt-1 font-bold">
            {formatPrice(currentPrice, currency)}
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-3">
          <p className="flex items-center gap-1 text-xs text-green-700">
            <ArrowDown className="h-3 w-3" />
            Lowest
          </p>

          <p className="mt-1 font-bold text-green-700">
            {formatPrice(lowest, currency)}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-3">
          <p className="flex items-center gap-1 text-xs text-red-700">
            <ArrowUp className="h-3 w-3" />
            Highest
          </p>

          <p className="mt-1 font-bold text-red-700">
            {formatPrice(highest, currency)}
          </p>
        </div>
      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 5,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />

              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{
              fontSize: 11,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{
              fontSize: 11,
            }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatPrice(value, currency)}
          />

          <Tooltip content={<CustomTooltip currency={currency} />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            animationDuration={800}
            dot={
              data.length <= 8
                ? {
                    r: 4,
                    fill: "#f97316",
                  }
                : false
            }
            activeDot={{
              r: 6,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
