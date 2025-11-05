import { useEffect, useState } from "react";

export default function LivePrice({ symbol }) {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/quotes/${symbol}/`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "tick") {
        setPrice(msg);
      }
    };

    return () => ws.close();
  }, [symbol]);

  if (!price) return <div className="text-gray-400">Loading {symbol}...</div>;

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-lg 
                    bg-white/10 border border-white/20 backdrop-blur-md mb-2">
      <span className="font-semibold">{price.symbol}</span>
      <span className="text-green-400">{price.last.toFixed(5)}</span>
    </div>
  );
}
