import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../../api/config"; // Import API_BASE for ws normalization

// Helper: infer price precision by symbol
function formatPrice(price, symbol) {
  if (price == null) return "--";
  const jpy = /JPY$/.test(symbol);
  return Number(price).toFixed(jpy ? 3 : 5);
}

// Normalize API_BASE to ws/wss URL (same as capitalStream.js)
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
  speed = 60, // px/sec for marquee
  labels = {}, // optional map { EURUSD: "Euro", ... } for friendly display
}) {
  const [data, setData] = useState(() =>
    symbols.reduce((acc, s) => {
      acc[s] = { symbol: s, last: null, change_pct: 0 };
      return acc;
    }, {})
  );

  // Stable reference for symbols to prevent unnecessary re-runs
  const symbolsKey = useMemo(() => symbols.sort().join(","), [symbols]);

  // Create WebSocket URLs (stable reference)
  const wsUrls = useMemo(() => {
    const wsBase = toWsBase(API_BASE);
    return symbols.map((sym) => `${wsBase}/ws/quotes/${sym}/`);
  }, []); // Only depends on API_BASE, not symbols

  useEffect(() => {
    const sockets = [];

    // Create or reuse sockets for each symbol
    symbols.forEach((sym, index) => {
      const ws = new WebSocket(wsUrls[index]);
      
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
                change_pct: msg.change_pct != null 
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
      
      ws.onerror = (e) => {
        console.error(`Quote socket error for ${sym}:`, e);
      };
      
      ws.onclose = () => {
        console.log(`Quote socket closed for ${sym}`);
      };
      
      sockets.push(ws);
    });

    // Cleanup function
    return () => {
      sockets.forEach((ws) => {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.close(1000, "TickerTopbar cleanup");
          }
        } catch (e) {
          console.error("Error closing WebSocket", e);
        }
      });
    };
  }, [symbolsKey, wsUrls]); // Only recreate when symbols list or ws base changes

  // Build ticker items from state
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

    // Width of a single set (half of duplicated content)
    const singleWidth = el.scrollWidth / 2;
    const duration = singleWidth / speed; // seconds
    el.style.setProperty("--ticker-duration", `${Math.max(duration, 10)}s`);
  }, [items, speed]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0e1220]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0e1220] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0e1220] to-transparent z-10" />

      <div
        ref={trackRef}
        className="flex items-stretch gap-4 py-3 animate-ticker hover:[animation-play-state:paused]"
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
    <div className="
      min-w-[180px] sm:min-w-[220px] md:min-w-[320px] max-w-[360px] flex-auto
      rounded-2xl bg-[#0b0f1a] border border-white/10 px-2 sm:px-4 lg:px-5 py-3 
      flex items-center justify-between"
    >
      {/* Left: label */}
      <div>
        <div className="text-xl font-extrabold text-gray-100 leading-5">
          {item.display}
        </div>
        <div className="text-sm tracking-wide text-slate-300/80">{pairDisplay}</div>
      </div>

      {/* Right: live price + change */}
      <div className="text-right">
        <div className="text-2xl font-extrabold text-gray-100">
          {item.price != null ? formatPrice(item.price, item.symbol) : "--"}
        </div>
        <div className={`text-base font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
          {isUp ? "+" : ""}
          {(item.changePct ?? 0).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
