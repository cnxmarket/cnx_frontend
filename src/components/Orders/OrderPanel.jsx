import { useState } from "react";

export default function OrderPanel({ symbol }) {
  const [tab, setTab] = useState("market");
  const [lotSize, setLotSize] = useState(1);
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");

  const handleOrder = (side) => {
    console.log(`Placing ${side} order`, {
      type: tab,
      lotSize,
      takeProfit,
      stopLoss,
    });
    // 🔥 Later: integrate with backend API
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-white/10">
        {["market", "limit", "stop"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium capitalize transition ${
              tab === t
                ? "bg-green-500/20 text-green-400"
                : "hover:bg-white/10 text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Symbol */}
      <div className="text-lg font-semibold text-center">
        Place Order – <span className="text-green-400">{symbol}</span>
      </div>

      {/* Lot Size */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Lot Size</label>
        <input
          type="number"
          value={lotSize}
          onChange={(e) => setLotSize(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-green-400"
          step="0.01"
          min="0.01"
        />
      </div>

      {/* Take Profit */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Take Profit</label>
        <input
          type="number"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-green-400"
        />
      </div>

      {/* Stop Loss */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Stop Loss</label>
        <input
          type="number"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-green-400"
        />
      </div>

      {/* Buy/Sell Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleOrder("buy")}
          className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-500 transition text-white font-semibold"
        >
          Buy
        </button>
        <button
          onClick={() => handleOrder("sell")}
          className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-500 transition text-white font-semibold"
        >
          Sell
        </button>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-lg bg-white/5 border border-white/10 p-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Margin Required</span>
          <span className="font-mono">$120.50</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Estimated PnL</span>
          <span className="font-mono text-green-400">+35.20</span>
        </div>
      </div>
    </div>
  );
}
