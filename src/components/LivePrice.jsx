import { useEffect, useState } from "react";
import { WS_BASE } from "../api/config";

const join = (base, path) => {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

export default function LivePrice({ symbol }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const url = join(WS_BASE, `/ws/quotes/${encodeURIComponent(symbol)}/`);
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg?.type === "tick") setPrice(msg);
      } catch {}
    };

    ws.onerror = () => {};
    return () => { try { ws.close(); } catch {} };
  }, [symbol]);

  if (!price) return <div className="text-gray-400">Loading {symbol}...</div>;

  const last = Number(price.last);
  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md mb-2">
      <span className="font-semibold">{price.symbol}</span>
      <span className="text-green-400">{Number.isFinite(last) ? last.toFixed(5) : "-"}</span>
    </div>
  );
}
