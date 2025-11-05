const timeframes = ["1m", "5m", "15m", "1h", "1d"];

export default function TimeframeSelector({ activeTF, onChange }) {
  return (
    <div className="flex gap-3 mb-4 justify-center">
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={`px-4 py-1 rounded-lg border transition ${
            activeTF === tf
              ? "bg-green-500/20 border-green-500 text-green-400"
              : "border-white/20 hover:bg-white/10"
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
