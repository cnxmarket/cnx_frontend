import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { API_BASE, WS_BASE } from "../api/config";

// safe join helpers
const join = (base, path) => {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};
const wsJoin = (base, path) => join(base, path); // same rule; keeps it simple

export default function Chart({ symbol }) {
  const chartContainerRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#e5e7eb",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true },
    });

    // Candlestick series
    const series = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      priceFormat: { type: "price", precision: 5, minMove: 0.00001 },
    });
    seriesRef.current = series;

    // Fetch historical candles
    fetch(
      join(
        API_BASE,
        `/api/candles?symbol=${encodeURIComponent(symbol)}&interval=1m&limit=100`
      ),
      { credentials: "include" } // remove if you don't use cookies/session
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length && seriesRef.current) {
          seriesRef.current.setData(data);
        }
      })
      .catch(() => {});

    // Live WebSocket (NOTE trailing slash after symbol)
    const wsUrl = wsJoin(WS_BASE, `/ws/quotes/${encodeURIComponent(symbol)}/`);
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg?.type === "tick" && seriesRef.current) {
          const price = parseFloat(msg.last);
          seriesRef.current.update({
            time: msg.ts,
            open: price,
            high: price,
            low: price,
            close: price,
          });
        }
      } catch {
        // ignore malformed messages
      }
    };

    // Resize handling
    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      try { ws.close(); } catch {}
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [symbol]);

  return <div ref={chartContainerRef} className="flex-1 w-full h-[500px]" />;
}
