import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../../api/config";

/* ---------- helpers ---------- */

// Smarter precision by symbol
function formatPrice(price, symbol = "") {
  if (price == null || Number.isNaN(Number(price))) return "--";
  const s = String(symbol).toUpperCase();
  const isJPY = /JPY$/.test(s);
  const isCrypto =
    /USDT$/.test(s) || /(BTC|ETH|SOL|BNB|XRP|DOGE|ADA|MATIC)/.test(s);
  const d = isJPY ? 3 : isCrypto ? 2 : 5;
  return Number(price).toFixed(d);
}

// Normalize API_BASE → ws/wss
function toWsBase(base) {
  try {
    const abs = base.startsWith("http")
      ? base
      : `${window.location.protocol}//${window.location.host}${base.startsWith("/") ? "" : "/"}${base}`;
    const u = new URL(abs);
    u.protocol = u.protocol === "https:" ? "wss:" : "ws:";
    return u.toString().replace(/\/$/, "");
  } catch {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}`;
  }
}

export default function TickerTopbar({
  symbols = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "BTCUSDT"],
  speed = 60,
  labels = {},
}) {
  const [data, setData] = useState(() =>
    symbols.reduce((acc, s) => {
      acc[s] = { symbol: s, last: null, change_pct: 0 };
      return acc;
    }, {})
  );

  // stable keys
  const symbolsKey = useMemo(() => symbols.slice().sort().join(","), [symbols]);

  // Recompute ws urls if symbols OR base change
  const wsUrls = useMemo(() => {
    const wsBase = toWsBase(API_BASE);
    return symbols.map((sym) => `${wsBase}/ws/quotes/${sym}/`);
  }, [symbolsKey]); // (API_BASE is constant at runtime in most setups)

  useEffect(() => {
    const sockets = symbols.map((sym, i) => {
      const ws = new WebSocket(wsUrls[i]);

      ws.onopen = () => console.log(`Quote socket opened for ${sym}`);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data || "{}");
          if (msg.type === "tick") {
            setData((prev) => ({
              ...prev,
              [sym]: {
                symbol: msg.symbol || sym,
                last: parseFloat(msg.last),
                change_pct:
                  msg.change_pct != null
                    ? Number(msg.change_pct)
                    : prev[sym]?.change_pct ?? 0,
                ts: msg.ts,
              },
            }));
          }
        } catch (e) {
          console.error(`TickerTopbar ws parse error for ${sym}`, e);
        }
      };

      ws.onerror = (e) => console.error(`Quote socket error for ${sym}:`, e);
      ws.onclose = () => console.log(`Quote socket closed for ${sym}`);

      return ws;
    });

    return () => {
      sockets.forEach((ws) => {
        try {
          if (ws.readyState === WebSocket.OPEN) ws.close(1000, "TickerTopbar cleanup");
        } catch (e) {
          console.error("Error closing WebSocket", e);
        }
      });
    };
  }, [symbolsKey, wsUrls]);

  // Build items
  const items = useMemo(() => {
    return symbols.map((sym) => {
      const d = data[sym] || {};
      const disp =
        labels[sym] ||
        sym.replace(/([A-Z]{3})([A-Z]{3})/, (_m, a, b) => `${a}/${b}`);
      return {
        symbol: sym,
        display: disp,
        price: d.last,
        changePct: d.change_pct ?? 0,
      };
    });
  }, [symbols, data, labels]);

  // Marquee setup
  const trackRef = useRef(null);
  const looped = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const singleWidth = el.scrollWidth / 2;
    const duration = singleWidth / speed;
    el.style.setProperty("--ticker-duration", `${Math.max(duration, 10)}s`);
  }, [items, speed]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0e1220]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0e1220] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0e1220] to-transparent z-10" />

      <div
        ref={trackRef}
        className="flex items-stretch gap-3 sm:gap-4 py-3 animate-ticker hover:[animation-play-state:paused]"
        style={{ animationDuration: "var(--ticker-duration, 40s)" }}
      >
        {looped.map((t, idx) => (
          <TickerCard key={`${t.symbol}-${idx}`} item={t} />
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation-name: ticker-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}

function TickerCard({ item }) {
  const isUp = (item.changePct ?? 0) >= 0;
  const pairDisplay = item.symbol.replace(/([A-Z]{3})([A-Z]{3})/, "$1/$2");

  return (
    <div
      className="
        min-w-[180px] sm:min-w-[220px] md:min-w-[280px] max-w-[360px] flex-auto
        rounded-2xl bg-[#0b0f1a] border border-white/10 px-3 sm:px-4 lg:px-5 py-3
        flex items-center justify-between gap-3
      "
    >
      {/* Left */}
      <div className="min-w-0">
        <div className="text-[clamp(12px,1.9vw,16px)] font-semibold text-gray-100 truncate">
          {item.display}
        </div>
        <div className="text-[clamp(11px,1.6vw,14px)] tracking-wide text-slate-300/80 truncate">
          {pairDisplay}
        </div>
      </div>

      {/* Right */}
      <div className="min-w-0 text-right">
        <div
          className="
            font-extrabold text-gray-100 font-mono tabular-nums
            text-[clamp(14px,3.2vw,22px)] leading-6
            overflow-hidden text-ellipsis
          "
          title={item.price != null ? formatPrice(item.price, item.symbol) : "--"}
        >
          {item.price != null ? formatPrice(item.price, item.symbol) : "--"}
        </div>

        {/* If you want change %, uncomment + keep it compact */}
        {/* <div className={`text-[clamp(11px,1.4vw,13px)] font-semibold ${isUp ? "text-green-400" : "text-red-400"} truncate`}>
          {isUp ? "+" : ""}
          {(item.changePct ?? 0).toFixed(2)}%
        </div> */}
      </div>
    </div>
  );
}
