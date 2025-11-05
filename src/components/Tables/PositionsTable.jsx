import React, { useEffect, useState } from "react";
import { connectUserStream } from "../../ws/userStream"; // Adjust if path is different

export default function PositionsTable() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const ws = connectUserStream((msg) => {
      if (msg.type === "positions_snapshot" && Array.isArray(msg.data)) {
        setPositions(msg.data);
      }
      if (msg.type === "positions_update" && msg.data) {
        setPositions(prev => {
          const idx = prev.findIndex(p => p.id === msg.data.id);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...msg.data };
            return updated;
          }
          return [...prev, msg.data];
        });
      }
    });
    return () => ws.close();
  }, []);

  return (
    <div className="bg-[#181926] rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Realtime Positions</h2>
      <table className="min-w-full">
        <thead className="bg-white/10 text-gray-100">
          <tr>
            <th className="px-6 py-4 text-left font-bold">SYMBOL</th>
            <th className="px-6 py-4 text-left font-bold">SIDE</th>
            <th className="px-6 py-4 text-left font-bold">LOTS</th>
            <th className="px-6 py-4 text-left font-bold">OPEN PRICE</th>
            <th className="px-6 py-4 text-left font-bold">CURRENT PRICE</th>
            <th className="px-6 py-4 text-left font-bold">OPEN TIME</th>
            <th className="px-6 py-4 text-left font-bold">UNREAL PNL</th>
          </tr>
        </thead>
        <tbody className="text-gray-300 text-lg">
          {positions.length === 0 ? (
            <tr>
              <td className="px-6 py-4" colSpan={7}>No open positions</td>
            </tr>
          ) : (
            positions.map(pos => (
              <tr key={pos.id} className="border-b border-white/10">
                <td className="px-6 py-4">{pos.symbol}</td>
                <td className={`px-6 py-4 font-bold ${pos.side === "Buy" ? "text-green-400" : "text-red-400"}`}>
                  {pos.side}
                </td>
                <td className="px-6 py-4">{Number(pos.net_lots || pos.lots).toFixed(2)}</td>
                <td className="px-6 py-4">{pos.open_price ? Number(pos.open_price).toLocaleString() : "--"}</td>
                <td className="px-6 py-4">{pos.mark ? Number(pos.mark).toLocaleString() : "--"}</td>
                <td className="px-6 py-4">
                  {pos.open_time
                    ? new Date(pos.open_time * 1000).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "--"}
                </td>
                <td className={`px-6 py-4 font-semibold ${pos.unreal_pnl < 0 ? "text-red-400" : "text-green-400"}`}>
                  {pos.unreal_pnl !== undefined
                    ? Number(pos.unreal_pnl).toFixed(2)
                    : "--"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
