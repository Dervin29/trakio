"use client";

import { useEffect, useId, useState, useMemo } from "react";
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
  Calendar,
} from "lucide-react";

import { getPriceHistory } from "@/app/actions";
import { formatPrice } from "@/utils/currency";

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All", days: null },
];

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-popover px-4 py-3 shadow-xl">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-foreground">
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
  const [range, setRange] = useState("30d");

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
            rawDate: new Date(item.checked_at),
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

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    const selected = RANGES.find((r) => r.label === range);
    if (!selected || !selected.days) return data;
    const dataEnd = data[data.length - 1].rawDate.getTime();
    const rangeMs = selected.days * 24 * 60 * 60 * 1000;
    const cutoff = dataEnd - rangeMs;
    return data.filter((d) => d.rawDate.getTime() >= cutoff);
  }, [data, range]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading price history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-destructive/10 p-5 text-center text-sm text-destructive">
        Unable to load price history.
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 py-16 text-center">
        <History className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="font-medium text-foreground">No price history yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Data will appear after the next price check.
        </p>
      </div>
    );
  }

  if (!filteredData.length) {
    return (
      <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-brand" />
            Price History
          </h3>
          <p className="text-xs text-muted-foreground">
            {data.length} price checks recorded
          </p>
        </div>
        <div className="inline-flex gap-1 rounded-lg bg-muted p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.label}
                onClick={() => setRange(r.label)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  range === r.label
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Calendar className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No data for this range</p>
          <button
            onClick={() => setRange("All")}
            className="mt-2 text-xs font-medium text-brand hover:text-brand-dark"
          >
            View all time
          </button>
        </div>
      </div>
    );
  }

  const firstPrice = filteredData[0].price;
  const currentPrice = filteredData.at(-1).price;
  const highest = Math.max(...filteredData.map((item) => item.price));
  const lowest = Math.min(...filteredData.map((item) => item.price));
  const change = ((currentPrice - firstPrice) / firstPrice) * 100;
  const priceDropped = change < 0;

return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-brand" />
            Price History
          </h3>
          <p className="text-xs text-muted-foreground">
            {filteredData.length} of {data.length} price checks
          </p>
        </div>
        <div className="inline-flex gap-1 rounded-lg bg-muted p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.label)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  range === r.label
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl bg-muted/50 p-2 sm:p-3">
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="mt-1 font-bold text-foreground">
            {formatPrice(currentPrice, currency)}
          </p>
        </div>
        <div className="rounded-xl bg-success/10 p-2 sm:p-3">
          <p className="flex items-center gap-1 text-xs text-success">
            <ArrowDown className="h-3 w-3" />
            Lowest
          </p>
          <p className="mt-1 font-bold text-success">
            {formatPrice(lowest, currency)}
          </p>
        </div>
        <div className="rounded-xl bg-destructive/10 p-2 sm:p-3">
          <p className="flex items-center gap-1 text-xs text-destructive">
            <ArrowUp className="h-3 w-3" />
            Highest
          </p>
          <p className="mt-1 font-bold text-destructive">
            {formatPrice(highest, currency)}
          </p>
        </div>
      </div>

      {/* Overall change */}
      <div
        className={`flex items-center gap-2 text-sm font-medium ${
          priceDropped
            ? "text-success"
            : change > 0
            ? "text-destructive"
            : "text-muted-foreground"
        }`}
      >
        {priceDropped ? (
          <TrendingDown className="h-4 w-4" />
        ) : change > 0 ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
        <span>
          {change > 0 ? "+" : ""}
          {change.toFixed(1)}% overall change
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
          >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatPrice(value, currency)}
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--brand)"
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            animationDuration={800}
            dot={filteredData.length <= 8 ? { r: 4, fill: "var(--brand)" } : false}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
