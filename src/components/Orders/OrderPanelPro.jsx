// src/components/trade/OrderPanelPro.jsx (updated)

import { useEffect, useMemo, useState } from "react";
import { placeFill } from "../../api/trading";
import { API_BASE, WS_BASE } from "../../api/config";

// ---- Precision helpers ----
const precisionBySymbol = (s = "") =>
  /JPY$/.test(s) ? 3 : /XAU|GOLD/i.test(s) ? 2 : 5;
const minMoveBySymbol = (s = "") =>
  /JPY$/.test(s) ? 0.001 : /XAU|GOLD/i.test(s) ? 0.01 : 0.00001;
const contractSizeBySymbol = (s = "") => {
  if (/BTCUSDT|BTCUSD/i.test(s)) return 1; // adjust if your platform uses 0.01 lots for BTC
  if (/XAU|GOLD/i.test(s)) return 100;
  return 100000;
};

// Commission table (round-turn, per lot)
const COMM_TABLE = { DEFAULT: 7.0 };

// ---- URL helpers ----
const join = (base, path) => {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

export default function OrderPanelPro({
  symbol = "EURUSD",
  wsBase,            // optional override; otherwise derived from WS_BASE
  defaultLots = 1,
}) {
  const [formType, setFormType] = useState("Regular form");
  const [mode, setMode] = useState("Market"); // Market | Pending
  const [pendingType, setPendingType] = useState("Limit");
  const [lots, setLots] = useState(defaultLots);
  const [tpType, setTpType] = useState("Price"); // Price | Pips
  const [slType, setSlType] = useState("Price");
  const [tp, setTp] = useState("");
  const [sl, setSl] = useState("");
  const [leverage, setLeverage] = useState(500); // 1:500 .. 1:5000
  const [bid, setBid] = useState(null);
  const [ask, setAsk] = useState(null);
  const [last, setLast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [priceOverride, setPriceOverride] = useState("");

  // Build WS quotes base from WS_BASE or override
  const quotesBase = useMemo(
    () => (wsBase ? wsBase.replace(/\/$/, "") : join(WS_BASE, "/ws/quotes")),
    [wsBase]
  );

  // Listen for live quotes
  useEffect(() => {
    const ws = new WebSocket(`${quotesBase}/${encodeURIComponent(symbol)}/`);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data || "{}");
        if (msg?.type !== "tick") return;
        if (msg.bid == null || msg.ask == null) return;

        const b = Number(msg.bid);
        const a = Number(msg.ask);
        if (!Number.isFinite(b) || !Number.isFinite(a)) return;

        setBid(b);
        setAsk(a);
        const l = Number(msg.last ?? (b + a) / 2);
        setLast(Number.isFinite(l) ? l : null);
      } catch {
        /* ignore parse errors */
      }
    };
    ws.onerror = () => {};
    return () => {
      try { ws.close(); } catch {}
    };
  }, [symbol, quotesBase]);

  const precision = useMemo(() => precisionBySymbol(symbol), [symbol]);
  const fmt = (v) => (v == null ? "--" : Number(v).toFixed(precision));

  const spread = useMemo(() => {
    if (bid == null || ask == null) return null;
    const s = ask - bid;
    return Math.abs(s) < 1e-12 ? 0 : s;
  }, [bid, ask]);

  const marginRequired = useMemo(() => {
    if (ask == null) return 0;
    const contract = contractSizeBySymbol(symbol);
    return (Number(lots) * contract * ask) / leverage;
  }, [symbol, lots, ask, leverage]);

  const commissionRtPerLot = COMM_TABLE.DEFAULT;
  const commission = useMemo(
    () => Number(lots) * commissionRtPerLot,
    [lots, commissionRtPerLot]
  );

  const pipValue = useMemo(() => {
    const contract = contractSizeBySymbol(symbol);
    const pip = /JPY$/.test(symbol) ? 0.001 : 0.0001;
    return Number(lots) * contract * pip;
  }, [symbol, lots]);

  // Margin check before order
  async function validateMarginBeforeOrder(symbol, lots, price, leverage) {
    try {
      const accessToken = localStorage.getItem("access");
      const response = await fetch(join(API_BASE, "/api/margin/check"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // JWT
        },
        body: JSON.stringify({ symbol, lots, price, leverage }),
        credentials: "include", // harmless for JWT; needed if you also use cookies
      });

      const data = await response.json();
      if (!response.ok) {
        setError(`Order blocked: ${data.error || "margin check failed"}`);
        return false;
      }
      setError("");
      return true;
    } catch {
      setError("Margin check failed.");
      return false;
    }
  }

  // Submit order to backend
  const submit = async (side) => {
    setError("");
    setLoading(true);

    try {
      const execPrice = priceOverride
        ? Number(priceOverride)
        : side === "Buy"
        ? ask
        : bid;

      if (!Number.isFinite(execPrice)) {
        throw new Error("Current price unavailable for execution.");
      }

      // Validate margin
      const isMarginOk = await validateMarginBeforeOrder(
        symbol,
        Number(lots),
        execPrice,
        leverage
      );
      if (!isMarginOk) {
        setLoading(false);
        return;
      }

      // Place order
      await placeFill({
        symbol,
        side,
        lots: Number(lots),
        price: execPrice,
        leverage,
      });

      setPriceOverride("");
    } catch (e) {
      setError(e?.message ?? "Order submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          {symbol.replace(/([A-Z]{3})([A-Z]{3})/, "$1/$2")}
        </div>
      </div>

      {/* Sell / Buy tiles */}
      <div className="grid grid-cols-2 gap-3">
        <Tile color="red" label="Sell" price={fmt(bid)} />
        <Tile color="blue" label="Buy" price={fmt(ask)} />
      </div>

      {/* Spread chip */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>50%</span>
        <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-200">
          {spread == null ? "--" : spread === 0 ? "0 spread" : `${spread.toFixed(precision)} spread`}
        </span>
        <span>50%</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/10">
        <div className="h-full bg-red-500/70" style={{ width: "50%" }} />
        <div className="-mt-1.5 h-1.5 bg-blue-500/70" style={{ width: "50%" }} />
      </div>

      {/* Mode selector (you can re-enable Pending later) */}
      <div className="grid grid-cols-1 gap-2">
        {["Market"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-xl py-3 font-semibold border ${
              mode === m
                ? "border-green-400/60 bg-green-500/10 text-green-300"
                : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Volume */}
      <Labeled label="Volume">
        <div className="flex items-center rounded-xl border border-white/10 overflow-hidden">
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={lots}
            onChange={(e) => setLots(e.target.value)}
            className="w-full bg-white/5 px-3 py-2 font-mono focus:outline-none"
          />
          <span className="px-3 text-sm text-gray-400">Lots</span>
          <Stepper
            onDec={() => setLots((v) => Math.max(0.01, Number(v) - 0.01).toFixed(2))}
            onInc={() => setLots((v) => (Number(v) + 0.01).toFixed(2))}
          />
        </div>
      </Labeled>

      {/* Leverage slider */}
      <Labeled label="Leverage">
        <div className="rounded-xl border border-white/10 p-3 bg-white/5">
          <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
            <span>1:{leverage}</span>
            <span className="text-gray-400">500 → 5000</span>
          </div>
          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full accent-green-400"
          />
        </div>
      </Labeled>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => submit("Buy")}
          disabled={loading || ask == null}
          className="rounded-xl py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold"
        >
          {loading ? "Submitting..." : "Buy"}
        </button>
        <button
          onClick={() => submit("Sell")}
          disabled={loading || bid == null}
          className="rounded-xl py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold"
        >
          {loading ? "Submitting..." : "Sell"}
        </button>
      </div>

      {/* Errors + Summary */}
      {error && (
        <div className="rounded-md bg-rose-50 text-rose-700 text-sm px-3 py-2 mt-2">
          {error}
        </div>
      )}
      <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm space-y-2 mt-3">
        <RowKV k="Margin Required" v={`$${marginRequired.toFixed(2)}`} />
        <RowKV k="Estimated PnL (per 1 pip)" v={pipValue.toFixed(2)} />
        <RowKV k="Commission (round-turn)" v={`$${commission.toFixed(2)}`} />
        <RowKV k="Total trading cost" v={`$${commission.toFixed(2)}`} />
      </div>
    </div>
  );
}

// ---- Small UI bits ----

function Tile({ color, label, price }) {
  const textColor = color === "red" ? "text-red-300" : "text-blue-300";
  const bgColor = color === "red" ? "bg-red-500/5" : "bg-blue-500/5";
  const borderColor = color === "red" ? "border-red-400/40" : "border-blue-400/40";
  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} px-4 py-3`}>
      <div className={`${textColor} text-sm mb-1`}>{label}</div>
      <div className={`${textColor} text-2xl font-extrabold tabular-nums`}>{price}</div>
    </div>
  );
}

function Labeled({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-300">{label}</div>
      {children}
    </div>
  );
}

function SelectSmall({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function Stepper({ onDec, onInc }) {
  return (
    <div className="flex">
      <button
        onClick={onDec}
        className="px-3 bg-white/5 hover:bg-white/10 border-l border-white/10"
      >
        −
      </button>
      <button
        onClick={onInc}
        className="px-3 bg-white/5 hover:bg-white/10 border-l border-white/10"
      >
        +
      </button>
    </div>
  );
}

function RowKV({ k, v }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}
