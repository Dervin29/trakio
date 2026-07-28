"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPriceHistory } from "@/app/actions";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatPrice(price, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 2,
  }).format(price);
}

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white/95 px-3 py-2 text-sm shadow-lg backdrop-blur-sm">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold text-gray-900">
        {formatPrice(payload[0].value, currency)}
      </p>
    </div>
  );
}

export default function PriceChart({ productId, currency = "INR" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const history = await getPriceHistory(productId);
      const chartData = history.map((item, i) => ({
        date: new Date(item.checked_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: parseFloat(item.price),
      }));
      setData(chartData);
      setLoading(false);
    }
    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-400">
        No price history yet. Check back after the first update.
      </div>
    );
  }

  const firstPrice = data[0].price;
  const lastPrice = data[data.length - 1].price;
  const overallChange = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isUp = overallChange > 0;
  const isDown = overallChange < 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Price History</span>
        <div className="flex items-center gap-1.5 text-xs">
          {isUp ? (
            <TrendingUp className="h-3.5 w-3.5 text-red-500" />
          ) : isDown ? (
            <TrendingDown className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-gray-400" />
          )}
          <span
            className={
              isUp
                ? "text-red-500"
                : isDown
                  ? "text-green-500"
                  : "text-gray-400"
            }
          >
            {overallChange >= 0 ? "+" : ""}
            {overallChange.toFixed(1)}%
          </span>
          <span className="text-gray-400">all time</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${productId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v) => formatPrice(v, currency)}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={2}
            fill={`url(#gradient-${productId})`}
            dot={data.length <= 7 ? { fill: "#f97316", r: 3, strokeWidth: 0 } : false}
            activeDot={{ r: 5, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
