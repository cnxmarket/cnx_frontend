import { useState } from "react";

export default function Navbar() {
  const [openLang, setOpenLang] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 text-sm text-white/90">
        {/* Left: logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-white"></span>
            <span className="text-[15px] font-semibold tracking-tight">CNX Markets</span>
          </div>
        </div>

        {/* Center: links */}
        <ul className="hidden items-center gap-8 md:flex">
          <li><a href="/login" className="hover:text-white">Trading</a></li>
          {/* <li><a href="#download" className="hover:text-white">Download App</a></li> */}
          <li><a href="#about" className="hover:text-white">About</a></li>
          <li><a href="#help" className="hover:text-white">Help</a></li>
        </ul>

        {/* Right: language, sign in, try for free */}
        <div className="flex items-center gap-3">
          {/* Language (simple selector) */}
          <div className="relative">
            <button
              onClick={() => setOpenLang((v) => !v)}
              className="hidden items-center rounded-full bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 md:inline-flex"
              aria-label="Change language"
            >
              <span className="mr-1">🇬🇧</span> EN
            </button>
            {openLang && (
              <div className="absolute right-0 mt-2 w-28 rounded-lg border border-white/10 bg-black/90 p-1 text-xs shadow-xl">
                <button className="w-full rounded-md px-2 py-1.5 text-left hover:bg-white/5">EN 🇬🇧</button>
                <button className="w-full rounded-md px-2 py-1.5 text-left hover:bg-white/5">IN 🇮🇳</button>
                <button className="w-full rounded-md px-2 py-1.5 text-left hover:bg-white/5">ID 🇮🇩</button>
              </div>
            )}
          </div>

          <a
            href="/login"
            className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
          >
            Sign in
          </a>

          <a
            href="/register"
            className="rounded-full bg-[#18e25d] px-4 py-2 text-xs font-semibold text-black hover:opacity-90"
          >
            Try for free
          </a>
        </div>
      </nav>
    </header>
  );
}
