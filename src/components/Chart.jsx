import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";

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
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
    });

    // Add candlestick series
    seriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      priceFormat: {
        type: "price",
        precision: 5,
        minMove: 0.00001,
      },
    });

    // Fetch historical candles
    fetch(`http://127.0.0.1:8000/api/candles?symbol=${symbol}&interval=1m&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length) seriesRef.current.setData(data);
      });

    // Live WebSocket
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/quotes/${symbol}/`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "tick") {
        const bar = {
          time: msg.ts,
          open: parseFloat(msg.last),
          high: parseFloat(msg.last),
          low: parseFloat(msg.last),
          close: parseFloat(msg.last),
        };
        seriesRef.current.update(bar);
      }
    };

    // Resize handling
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      ws.close();
      chart.remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [symbol]);

  return <div ref={chartContainerRef} className="flex-1 w-full h-[500px]" />;
}
