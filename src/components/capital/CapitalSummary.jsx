import { useMemo } from "react";
import { useCapitalContext } from "../context/CapitalContext";
import { ArrowPathIcon, BanknotesIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";

function fmt(n, currency = "$") {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "—";
  return `${currency}${Number(n).toFixed(2)}`;
}

function Skeleton() {
  return (
    <div className="animate-pulse grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-8 rounded bg-white/10" />
      ))}
    </div>
  );
}

/**
 * CapitalSummary (theme-matched)
 *
 * Reads values from CapitalContext, so you can drop it anywhere.
 * Props:
 *  - className?: string
 *  - currency?: string (default "$")
 *  - loading?: boolean (optional; if your context exposes a loading flag)
 */
export default function CapitalSummary({ className = "", currency = "$", loading = false }) {
  const { balance, equity, used_margin, free_margin, refreshCapital } = useCapitalContext();

  const usage = useMemo(() => {
    const e = Number(equity ?? 0);
    const u = Number(used_margin ?? 0);
    if (!Number.isFinite(e) || e <= 0) return 0;
    const r = Math.min(100, Math.max(0, (u / e) * 100));
    return Math.round(r);
  }, [equity, used_margin]);

  const usageTone = usage >= 80 ? "bg-red-500" : usage >= 50 ? "bg-amber-400" : "bg-emerald-500";

  return (
    <div className={`rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4 ${className}`}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BanknotesIcon className="h-5 w-5 text-white/70" />
          <h3 className="text-white/90 font-semibold">Account Overview</h3>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 px-3 py-1.5 text-xs transition"
          onClick={refreshCapital}
          title="Refresh"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <Skeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm sm:text-base">
          <CardStat label="Balance" value={fmt(balance, currency)} />
          <CardStat label="Equity" value={fmt(equity, currency)} />
          <CardStat label="Used Margin" value={fmt(used_margin, currency)} />
          <CardStat label="Free Margin" value={fmt(free_margin, currency)} />
        </div>
      )}

      {/* Usage bar */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
          <ChartBarSquareIcon className="h-4 w-4" />
          <span>Margin Usage</span>
          {!loading && <span className="ml-auto text-white/70">{usage}%</span>}
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full ${usageTone} transition-all`} style={{ width: loading ? "0%" : `${usage}%` }} />
        </div>
        {!loading && (
          <p className="mt-1 text-[11px] text-white/50">
            {usage >= 80
              ? "High margin usage — consider reducing exposure."
              : usage >= 50
              ? "Moderate margin usage — keep an eye on volatility."
              : "Healthy margin usage."}
          </p>
        )}
      </div>
    </div>
  );
}

function CardStat({ label, value }) {
  return (
    <div className="group flex items-center justify-between rounded-xl px-3 py-2 bg-white/3 hover:bg-white/5 transition">
      <span className="text-white/70">{label}</span>
      <span className="font-semibold tabular-nums text-white group-hover:text-white">{value}</span>
    </div>
  );
}
