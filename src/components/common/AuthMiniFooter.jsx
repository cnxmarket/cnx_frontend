// src/components/common/AuthMiniFooter.jsx
import { Link } from "react-router-dom";

export default function AuthMiniFooter({
  brand = "CNX markets",
  since = 2014,
  langLabel = "English",
  langFlag = "🇬🇧",
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: brand + links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="text-sm text-white/80">
              <span className="font-semibold">{brand}</span>
              <span className="mx-2 text-white/50">•</span>
              <span className="text-white/60">
                © {since} — {year}
              </span>
            </div>

            <nav className="flex items-center gap-4">
              <Link to="/legal/regulation" className="text-sm text-[#18e25d] hover:opacity-90">
                Regulation
              </Link>
              <Link to="/legal" className="text-sm text-[#18e25d] hover:opacity-90">
                Legal information
              </Link>
            </nav>
          </div>

          {/* Right: language pill (static for now) */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white/80 backdrop-blur
                       hover:border-white/25 hover:text-white transition"
            aria-label="Change language"
          >
            <span className="text-base leading-none">{langFlag}</span>
            <div className="text-left leading-tight">
              <div className="text-[11px] text-white/50">Language</div>
              <div className="font-medium">{langLabel}</div>
            </div>
            <svg className="ml-1 h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
