import { useState, useEffect } from "react";
import { listOrders } from "../../api/trading"; // Adjust path if needed
import { connectUserStream } from "../../ws/userStream"; // Adjust path
import { API_BASE } from "../../api/config"; // adjust path as needed

export default function TradesPanel() {
  const [tab, setTab] = useState("positions");
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]); // normalized history rows

  // --- helpers: HISTORY ------------------------------------------------------
  const normalizeHistoryRow = (r, i = 0) => {
    const id = r.position_id ?? r.pos_id ?? r.ref ?? r.id ?? `hist-${i}`;
    const symbol = (r.symbol ?? "").toString().toUpperCase();
    const realizedRaw = r.realized_pnl ?? r.realized ?? r.pnl ?? r.profit ?? 0;
    const realized = Number(realizedRaw ?? 0);

    const closedAtRaw =
      r.closed_at ?? r.close_time ?? r.timestamp ?? r.ts ?? r.time ?? null;

    const closedAt =
      typeof closedAtRaw === "number"
        ? new Date(closedAtRaw > 2_000_000_000 ? closedAtRaw : closedAtRaw * 1000)
        : closedAtRaw
        ? new Date(closedAtRaw)
        : null;

    return { id, symbol, realized, closedAt };
  };

  const normalizeHistory = (arr) =>
    Array.isArray(arr) ? arr.map((r, i) => normalizeHistoryRow(r, i)) : [];

  // --- helpers: POSITIONS (to avoid blank rows) ------------------------------
  const normalizePosition = (p, i = 0) => {
    const id = p.id ?? p.position_id ?? p.pos_id ?? p.ref ?? `pos-${i}`;
    const symbol = (p.symbol ?? "").toString().toUpperCase() || null;
    const side = p.side === "Buy" || p.side === "Sell" ? p.side : null;
    const net_lots = p.net_lots != null ? Number(p.net_lots) : null;
    const open_price = p.open_price != null ? Number(p.open_price) : null;
    const mark = p.mark != null ? Number(p.mark) : null;
    const unreal_pnl = p.unreal_pnl != null ? Number(p.unreal_pnl) : null;
    const open_time =
      typeof p.open_time === "number"
        ? p.open_time
        : p.open_time
        ? Date.parse(p.open_time) / 1000
        : null;

    return { id, symbol, side, net_lots, open_price, mark, unreal_pnl, open_time };
  };

  const normalizePositions = (arr) =>
    Array.isArray(arr) ? arr.map((p, i) => normalizePosition(p, i)) : [];

  // Only show/append a position when it has the minimum required fields
  const hasMinimumFields = (p) =>
    !!(
      p.id &&
      p.symbol &&
      p.side &&
      Number.isFinite(p.open_price) &&
      Number(p.net_lots) > 0
    );

  // --------------------------------------------------------------------------

  useEffect(() => {
    // initial history load
    listOrders()
      .then((data) => setOrders(normalizeHistory(data)))
      .catch(() => {});

    // realtime stream
    const ws = connectUserStream((msg) => {
      // Replace positions with snapshot -> but only keep complete rows
      if (msg.type === "positions_snapshot" && Array.isArray(msg.data)) {
        setPositions(normalizePositions(msg.data).filter(hasMinimumFields));
      }

      // Incremental position update
      if (msg.type === "positions_update" && msg.data) {
        const upd = normalizePosition(msg.data);
        setPositions((prev) => {
          const idx = prev.findIndex((p) => p.id === upd.id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...upd };
            return copy;
          }
          // Only append a NEW row if it is complete; ignore partials
          return hasMinimumFields(upd) ? [...prev, upd] : prev;
        });
      }

      // History pushes (closed positions / ledger)
      if (
        (msg.type === "order_update" ||
          msg.type === "position_closed" ||
          msg.type === "ledger_entry") &&
        msg.data
      ) {
        const row = normalizeHistoryRow(msg.data);
        setOrders((prev) => {
          const idx = prev.findIndex((o) => o.id === row.id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...row };
            return copy;
          }
          return [row, ...prev];
        });
      }
    });

    return () => ws.close();
  }, []);

  async function exitPositionAPI(positionId, exitPrice) {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_BASE}/api/exit_position/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ position_id: positionId, exit_price: exitPrice }),
        credentials: "include",
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to exit position");
      }
      return await response.json();
    } catch (err) {
      alert(err.message);
      throw err;
    }
  }

  return (
    <div className="w-full">
      {/* Pill navigation */}
      <div className="flex gap-2 sm:gap-3 mb-4 flex-wrap">
        <button
          onClick={() => setTab("positions")}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition ${
            tab === "positions"
              ? "bg-green-500/20 text-green-400 border border-green-400/50"
              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
          }`}
        >
          Open Positions
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition ${
            tab === "history"
              ? "bg-green-500/20 text-green-400 border border-green-400/50"
              : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
          }`}
        >
          Trade History
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto max-h-[300px] overflow-y-auto rounded-xl border border-white/10">
        {tab === "positions" ? (
          <PositionsTable
            data={positions}
            exitPositionAPI={exitPositionAPI}
            setPositions={setPositions}
          />
        ) : (
          <HistoryTable data={orders} />
        )}
      </div>
    </div>
  );
}

function PositionsTable({ data, exitPositionAPI, setPositions }) {
  return (
    <table className="min-w-full text-xs sm:text-sm lg:text-base">
      <thead className="bg-[#222B34] text-[#8E98A6] font-medium">
        <tr>
          <th className="px-4 py-2 text-left">Symbol</th>
          <th className="px-3 py-2 text-left">Type</th>
          <th className="px-3 py-2 text-right">Volume</th>
          <th className="px-3 py-2 text-right">Open price</th>
          <th className="px-3 py-2 text-right">Current price</th>
          <th className="px-3 py-2 text-center">T/P</th>
          <th className="px-3 py-2 text-center">S/L</th>
          <th className="px-3 py-2 text-right">Open time</th>
          <th className="px-3 py-2 text-right">P/L, USD</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody className="text-white font-medium">
        {data.map((pos) => {
          const sideKnown = pos.side === "Buy" || pos.side === "Sell";
          return (
            <tr
              key={pos.id}
              className="border-b border-[#222B34] hover:bg-[#1A222B] transition"
            >
              <td className="px-4 py-2">
                <span className="text-[1.07em] font-semibold">
                  {pos.symbol}
                </span>
              </td>

              <td className="px-3 py-2">
                {sideKnown ? (
                  <span
                    className={`flex items-center gap-1 ${
                      pos.side === "Buy" ? "text-blue-400" : "text-red-400"
                    }`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        pos.side === "Buy" ? "bg-blue-400" : "bg-red-400"
                      }`}
                    />
                    {pos.side}
                  </span>
                ) : (
                  <span className="text-[#8E98A6]">—</span>
                )}
              </td>

              <td className="px-3 py-2 text-right">
                {Number.isFinite(pos.net_lots)
                  ? Number(pos.net_lots).toFixed(2)
                  : "--"}
              </td>
              <td className="px-3 py-2 text-right">
                {Number.isFinite(pos.open_price)
                  ? Number(pos.open_price).toLocaleString()
                  : "--"}
              </td>
              <td className="px-3 py-2 text-right">
                {Number.isFinite(pos.mark)
                  ? Number(pos.mark).toLocaleString()
                  : "--"}
              </td>

              <td className="px-3 py-2 text-center text-[#8E98A6] underline cursor-pointer">
                Add
              </td>
              <td className="px-3 py-2 text-center text-[#8E98A6] underline cursor-pointer">
                Add
              </td>

              <td className="px-3 py-2 text-right">
                {pos.open_time
                  ? new Date(pos.open_time * 1000).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--"}
              </td>

              <td
                className={`px-3 py-2 text-right font-semibold ${
                  Number(pos.unreal_pnl) > 0
                    ? "text-green-400"
                    : Number(pos.unreal_pnl) < 0
                    ? "text-red-400"
                    : "text-gray-200"
                }`}
              >
                {pos.unreal_pnl !== null && pos.unreal_pnl !== undefined
                  ? Number(pos.unreal_pnl).toFixed(2)
                  : "--"}
              </td>

              <td className="px-3 py-2 text-center">
                <button tabIndex={0} aria-label="Edit">
                  <svg
                    className="w-4 h-4 text-[#8E98A6] hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.364 5.636a2 2 0 0 0-2.828 0l-9.193 9.193a2 2 0 0 0-.513.857l-1.01 3.535a1 1 0 0 0 1.225 1.224l3.535-1.01a2 2 0 0 0 .858-.514l9.192-9.192a2 2 0 0 0 0-2.828z" />
                  </svg>
                </button>
              </td>

              <td className="px-3 py-2 text-center">
                <button
                  tabIndex={0}
                  aria-label="Close"
                  onClick={async () => {
                    try {
                      const exitPrice =
                        Number(pos.mark) || Number(pos.open_price);
                      await exitPositionAPI(pos.id, exitPrice);
                      setPositions((positions) =>
                        positions.filter((p) => p.id !== pos.id)
                      );
                    } catch (error) {}
                  }}
                >
                  <svg
                    className="w-4 h-4 text-[#8E98A6] hover:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function HistoryTable({ data }) {
  const getPnlClass = (v) =>
    v > 0 ? "text-green-400" : v < 0 ? "text-red-400" : "text-gray-200";

  return (
    <table className="min-w-full text-xs sm:text-sm lg:text-base">
      <thead className="bg-white/10 text-gray-100">
        <tr>
          <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left">
            Position ID
          </th>
          <th className="text-left">Symbol</th>
          <th className="text-left">Realized PnL</th>
          <th className="text-left">Closed At</th>
        </tr>
      </thead>

      <tbody className="text-gray-300">
        {data.map((row) => (
          <tr
            key={row.id}
            className="border-b border-white/10 hover:bg-white/5"
          >
            <td className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 font-mono">
              <span
                className="inline-block max-w-[360px] truncate align-bottom"
                title={row.id}
              >
                {row.id}
              </span>
            </td>
            <td className="uppercase">{row.symbol || "-"}</td>
            <td className={`font-semibold ${getPnlClass(row.realized)}`}>
              {Number.isFinite(row.realized)
                ? row.realized.toFixed(2)
                : "0.00"}
            </td>
            <td>
              {row.closedAt ? new Date(row.closedAt).toLocaleString() : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
