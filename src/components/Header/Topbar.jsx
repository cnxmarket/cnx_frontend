export default function Topbar({ symbol, price, high, low }) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-white/5 
                      backdrop-blur-lg border border-white/10 px-6 py-4">
        {/* Left: Pair Info */}
        <div>
          <div className="text-2xl font-bold">{symbol}</div>
          <div className="flex gap-6 text-sm text-gray-400 mt-1">
            <span>High: <span className="text-green-400">{high}</span></span>
            <span>Low: <span className="text-red-400">{low}</span></span>
          </div>
        </div>
  
        {/* Right: Current Price */}
        <div className="text-3xl font-mono font-bold text-green-400">
          {price}
        </div>
      </div>
    );
  }
  