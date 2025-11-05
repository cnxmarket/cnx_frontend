import { useState } from "react";

export default function HistoryTable() {
  // Mock closed trades – later hook into backend API
  const [history] = useState([
    {
      id: 101,
      symbol: "EURUSD",
      side: "Buy",
      lots: 1.0,
      entry: 1.17000,
      exit: 1.17250,
      pnl: 250.0,
      date: "2025-09-29 14:30",
    },
    {
      id: 102,
      symbol: "GBPUSD",
      side: "Sell",
      lots: 0.5,
      entry: 1.3100,
      exit: 1.3150,
      pnl: -250.0,
      date: "2025-09-29 16:45",
    },
  ]);

  return (
    <div className="rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 p-4">
      <h2 className="text-lg font-semibold mb-4">Trade History</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead className="text-gray-400 text-left border-b border-white/10">
            <tr>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Symbol</th>
              <th className="py-2 px-3">Side</th>
              <th className="py-2 px-3">Lots</th>
              <th className="py-2 px-3">Entry</th>
              <th className="py-2 px-3">Exit</th>
              <th className="py-2 px-3">PnL</th>
            </tr>
          </thead>
          <tbody>
            {history.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="py-2 px-3">{trade.date}</td>
                <td className="py-2 px-3">{trade.symbol}</td>
                <td
                  className={`py-2 px-3 font-semibold ${
                    trade.side === "Buy" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.side}
                </td>
                <td className="py-2 px-3">{trade.lots}</td>
                <td className="py-2 px-3">{trade.entry}</td>
                <td className="py-2 px-3">{trade.exit}</td>
                <td
                  className={`py-2 px-3 font-semibold ${
                    trade.pnl >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {trade.pnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
