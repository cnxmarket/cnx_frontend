// src/components/Chart/TradingViewChart.jsx
import { useEffect, useLayoutEffect, useRef } from "react";

function toTradingViewSymbol(sym) {
  const s = (sym || "").toUpperCase().trim();

  // Metals via OANDA
  if (s === "XAUUSD" || s === "XAGUSD") return `OANDA:${s}`;

  // Crypto via Binance
  if (s.endsWith("USDT")) return `BINANCE:${s}`;

  // Default: FX majors/minors
  return `FX:${s}`;
}

export default function TradingViewChart({
  symbol = "EURUSD",
  interval = "15",
  height,
  studies = [],
  hideTopToolbar = false,
  hideSideToolbar = false,
  allowSymbolChange = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const shimRef = useRef(null);
  const widgetRef = useRef(null);
  const roRef = useRef(null);

  useLayoutEffect(() => {
    let canceled = false;

    const ensureScript = () =>
      new Promise((resolve) => {
        if (window.TradingView?.widget) return resolve();
        const existing = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
        if (existing) return existing.addEventListener("load", () => resolve(), { once: true });
        const s = document.createElement("script");
        s.src = "https://s3.tradingview.com/tv.js";
        s.async = true;
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

    ensureScript().then(() => {
      if (canceled || !containerRef.current) return;

      // clean previous
      if (widgetRef.current?.remove) try { widgetRef.current.remove(); } catch {}
      containerRef.current.innerHTML = "";

      const id = `tvc_${Math.random().toString(36).slice(2)}`;
      containerRef.current.id = id;

      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol: toTradingViewSymbol(symbol), // <-- key change
        interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0d1117",
        enable_publishing: false,
        withdateranges: true,
        hide_top_toolbar: hideTopToolbar,
        hide_side_toolbar: hideSideToolbar,
        allow_symbol_change: allowSymbolChange,
        studies,
        container_id: id,
        overrides: {
          "paneProperties.background": "rgba(13,17,23,0)",
          "paneProperties.vertGridProperties.color": "rgba(255,255,255,0.06)",
          "paneProperties.horzGridProperties.color": "rgba(255,255,255,0.06)",
          "symbolWatermarkProperties.transparency": 92,
          "mainSeriesProperties.candleStyle.upColor": "#22c55e",
          "mainSeriesProperties.candleStyle.downColor": "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor": "#22c55e",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef4444",
        },
      });

      function syncHeightFromShim() {
        if (!containerRef.current || !shimRef.current) return;
        const h = height ?? shimRef.current.getBoundingClientRect().height;
        containerRef.current.style.height = `${Math.max(320, h || 0)}px`;
      }

      syncHeightFromShim();

      if (!roRef.current) {
        roRef.current = new ResizeObserver(() => syncHeightFromShim());
      }
      if (shimRef.current) roRef.current.observe(shimRef.current);

      const onWin = () => syncHeightFromShim();
      window.addEventListener("resize", onWin);

      containerRef.current.__syncHeightFromShim = syncHeightFromShim;

      return () => {
        window.removeEventListener("resize", onWin);
      };
    });

    return () => {
      canceled = true;
      try {
        roRef.current?.disconnect();
        if (widgetRef.current?.remove) widgetRef.current.remove();
      } catch {}
      widgetRef.current = null;
    };
  }, [symbol, interval, hideTopToolbar, hideSideToolbar, allowSymbolChange, height, JSON.stringify(studies)]);

  useEffect(() => {
    const sync = containerRef.current?.__syncHeightFromShim;
    if (typeof sync === "function") sync();
  });

  return (
    <div className={`relative w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg ${className}`}>
      {/* Invisible shim for responsive height */}
      <div
        ref={shimRef}
        className="h-[52vh] sm:h-[58vh] lg:h-[64vh] xl:h-[70vh] min-h-[320px] invisible"
        style={height ? { height } : undefined}
      />
      {/* TV chart container absolutely positioned to overlay shim */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
