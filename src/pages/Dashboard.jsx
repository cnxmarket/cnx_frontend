import { useOutletContext } from "react-router-dom";
import TickerTopbar from "../components/Header/TickerTopbar";
import TradingViewChart from "../components/Chart/TradingViewChart";
import OrderPanelPro from "../components/Orders/OrderPanelPro";
import TradesPanel from "../components/Tables/TradesPanel";
import { useCapitalContext } from "../context/CapitalContext";

export default function Dashboard() {
  const { symbol, setSymbol } = useOutletContext();
  const symbols = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "BTCUSDT"];
  const { balance, equity, used_margin, free_margin, refreshCapital } = useCapitalContext();

  const headerGap = "5.5rem";

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
      {/* Capital summary */}
      <div className="px-2 sm:px-4 lg:px-6 pt-3">
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm sm:text-base">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Balance</span>
              <span className="font-semibold">
                {balance ? `$${Number(balance).toFixed(2)}` : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Equity</span>
              <span className="font-semibold">
                {equity ? `$${Number(equity).toFixed(2)}` : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Used Margin</span>
              <span className="font-semibold">
                {used_margin ? `$${Number(used_margin).toFixed(2)}` : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Free Margin</span>
              <span className="font-semibold">
                {free_margin ? `$${Number(free_margin).toFixed(2)}` : "--"}
              </span>
            </div>
          </div>
          {/* OPTIONAL: Manual refresh button */}
          <button className="mt-3 ml-2 px-3 py-1 rounded bg-white/30 hover:bg-white/40 text-xs" onClick={refreshCapital}>
            Refresh Capital
          </button>
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
