import { useOutletContext } from "react-router-dom";
import TickerTopbar from "../components/Header/TickerTopbar";
import TradingViewChart from "../components/Chart/TradingViewChart";
import OrderPanelPro from "../components/Orders/OrderPanelPro";
import TradesPanel from "../components/Tables/TradesPanel";
import { useCapitalContext } from "../context/CapitalContext";
// import CapitalSummary from "../components/capital/CapitalSummary";
import { RefreshIcon, CurrencyDollarIcon, ChartSquareBarIcon } from "@heroicons/react/outline";



export default function Dashboard() {
  const { symbol, setSymbol } = useOutletContext();
  const symbols = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "BTCUSDT" , "XAUUSD", "NZDUSD"];
  const { balance, equity, used_margin, free_margin, refreshCapital } = useCapitalContext();

  const headerGap = "5.5rem";

  const fmt = (n, currency = "$") =>
    n === null || n === undefined || Number.isNaN(Number(n)) ? "—" : `${currency}${Number(n).toFixed(2)}`;

  const usagePct = (() => {
    const e = Number(equity ?? 0);
    const u = Number(used_margin ?? 0);
    if (!Number.isFinite(e) || e <= 0) return 0;
    return Math.round(Math.min(100, Math.max(0, (u / e) * 100)));
  })();
  const usageTone = usagePct >= 80 ? "bg-red-500" : usagePct >= 50 ? "bg-amber-400" : "bg-emerald-500";


  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
      {/* Capital summary */}
      <div className="px-2 sm:px-4 lg:px-6 pt-3">
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* 💰 */}
              <h3 className="text-white/90 font-semibold">Account Overview</h3>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 px-3 py-1.5 text-xs transition"
              onClick={refreshCapital}
              title="Refresh"
            >
              {/* ⟳ */}
              Refresh
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm sm:text-base">
            <div className="group flex items-center justify-between rounded-xl px-3 py-2 bg-white/3 hover:bg-white/5 transition">
              <span className="text-white/70">Balance</span>
              <span className="font-semibold tabular-nums text-white group-hover:text-white">
                {fmt(balance)}
              </span>
            </div>
            <div className="group flex items-center justify-between rounded-xl px-3 py-2 bg-white/3 hover:bg-white/5 transition">
              <span className="text-white/70">Equity</span>
              <span className="font-semibold tabular-nums text-white group-hover:text-white">
                {fmt(equity)}
              </span>
            </div>
            <div className="group flex items-center justify-between rounded-xl px-3 py-2 bg-white/3 hover:bg-white/5 transition">
              <span className="text-white/70">Used Margin</span>
              <span className="font-semibold tabular-nums text-white group-hover:text-white">
                {fmt(used_margin)}
              </span>
            </div>
            <div className="group flex items-center justify-between rounded-xl px-3 py-2 bg-white/3 hover:bg-white/5 transition">
              <span className="text-white/70">Free Margin</span>
              <span className="font-semibold tabular-nums text-white group-hover:text-white">
                {fmt(free_margin)}
              </span>
            </div>
          </div>

          {/* Margin usage */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs text-white/60 mb-1">
              {/* 📊 */}
              <span>Margin Usage</span>
              <span className="ml-auto text-white/70">{usagePct}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full ${usageTone} transition-all`} style={{ width: `${usagePct}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-white/50">
              {usagePct >= 80
                ? "High margin usage — consider reducing exposure."
                : usagePct >= 50
                  ? "Moderate margin usage — keep an eye on volatility."
                  : "Healthy margin usage."}
            </p>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="px-2 sm:px-4 lg:px-6 pt-3">
        <TickerTopbar symbols={symbols} />
      </div>
      <div
        className="
          px-2 sm:px-4 lg:px-6 py-4
          flex flex-col gap-4
          xl:grid xl:gap-4
          xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]
          xl:grid-rows-[minmax(0,60%)_minmax(0,40%)]
        "
        style={{ height: `calc(100vh - ${headerGap})` }}
      >
        <div
          className="
            rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4
            overflow-hidden
            h-[48vh] sm:h-[52vh] md:h-[56vh] lg:h-[58vh]
            xl:col-start-1 xl:row-start-1 xl:h-full
          "
        >
          <TradingViewChart symbol={symbol} interval="15" className="h-full" />
        </div>
        <aside
          className="
            rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4
            w-full
            max-h-[48vh] sm:max-h-[52vh] md:max-h-[56vh] lg:max-h-[58vh] overflow-auto
            xl:col-start-2 xl:row-span-2 xl:h-full xl:overflow-auto xl:sticky xl:top-4
          "
          style={{ maxHeight: `calc(100vh - ${headerGap})` }}
        >
          <OrderPanelPro symbol={symbol} />
        </aside>
        <div
          className="
            rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-2 sm:p-4
            max-h-[34vh] md:max-h-[36vh] lg:max-h-[38vh] overflow-auto
            xl:col-start-1 xl:row-start-2 xl:h-full
          "
        >
          <TradesPanel />
        </div>
      </div>
    </div>
  );
}
