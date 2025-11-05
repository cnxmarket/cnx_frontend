import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../api/trading"; // adjust path

export default function OrderHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchOrderHistory()
      .then((data) => {
        if (!active) return;
        const safe = Array.isArray(data) ? data : [];
        setRows(
          safe.map((r) => ({
            pos_id: r.pos_id ?? "-",
            symbol: r.symbol ?? "-",
            realized:
              typeof r.realized === "string"
                ? Number(r.realized)
                : Number(r.realized ?? 0),
            last_ts: r.last_ts ?? null,
          }))
        );
      })
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-[#181926] rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Order History</h2>
      {loading ? (
        <div className="text-gray-400 text-center py-8">Loading...</div>
      ) : (
        <table className="min-w-full">
          <thead className="bg-white/10 text-gray-100">
            <tr>
              <th className="px-6 py-4 text-left font-bold">Position ID</th>
              <th className="px-6 py-4 text-left font-bold">Symbol</th>
              <th className="px-6 py-4 text-left font-bold">Realized&nbsp;PnL</th>
              <th className="px-6 py-4 text-left font-bold">Closed&nbsp;At</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 text-lg">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center opacity-70">
                  No order history
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.pos_id} className="border-b border-white/10">
                  <td className="px-6 py-4 font-mono text-sm text-gray-400">
                    {row.pos_id}
                  </td>
                  <td className="px-6 py-4">{row.symbol}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      row.realized < 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {Number.isFinite(row.realized)
                      ? row.realized.toFixed(2)
                      : "0.00"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {row.last_ts
                      ? new Date(row.last_ts).toLocaleString(undefined, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "--"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
