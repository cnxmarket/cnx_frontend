// src/components/Tables/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../../api/trading"; // adjust import if needed

export default function OrderHistoryTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchOrderHistory();
        if (!mounted) return;
        const safe = Array.isArray(data) ? data : [];
        setRows(
          safe.map((r, i) => ({
            id: r.pos_id ?? r.position_id ?? r.ref ?? `row-${i}`,
            symbol: (r.symbol ?? "-").toString().toUpperCase(),
            realized: Number(
              typeof r.realized === "string" ? r.realized : r.realized ?? 0
            ),
            closedAt: r.closed_at ?? r.last_ts ?? r.ts ?? null,
          }))
        );
      } catch (e) {
        console.error("Failed to load order history", e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // helper to color-code realized PnL
  const getPnlClass = (value) => {
    if (value > 0) return "text-green-400";
    if (value < 0) return "text-red-400";
    return "text-gray-200";
  };

  return (
    <div className="p-4 text-left">
      <h1 className="mb-4 text-xl font-semibold text-white">Order History</h1>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0f141a]">
        <table className="min-w-full table-fixed">
          <thead>
            <tr className="bg-white/5">
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Position ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Realized PnL
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Closed At
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-sm text-gray-300">
                  Loading…
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-sm text-gray-300">
                  No order history
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-sm text-gray-200 font-mono">
                    <span
                      className="inline-block max-w-[360px] truncate align-bottom"
                      title={row.id}
                    >
                      {row.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {row.symbol}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-semibold ${getPnlClass(
                      row.realized
                    )}`}
                  >
                    {Number.isFinite(row.realized)
                      ? row.realized.toFixed(2)
                      : "0.00"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    {row.closedAt
                      ? new Date(row.closedAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
