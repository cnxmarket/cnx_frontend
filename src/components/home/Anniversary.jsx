// src/components/home/Anniversary.jsx
export default function Anniversary() {
    return (
      <section className="relative isolate bg-black">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          {/* canvas */}
          <div className="relative overflow-hidden rounded-3xl bg-black px-6 py-12 sm:py-16">
            {/* Green glow behind the number */}
            <div
              className="pointer-events-none absolute left-[18%] top-1/2 -z-10 h-[70%] w-[42%] -translate-y-1/2 rounded-[40%] blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(24,226,93,0.55) 0%, rgba(24,226,93,0.15) 45%, rgba(0,0,0,0) 70%)",
              }}
            />
  
            {/* 2-col layout: number left, text right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
              {/* Left: metallic “10” */}
              <div className="flex justify-center lg:justify-start">
                <svg
                  viewBox="0 0 520 300"
                  className="w-[60vw] max-w-[520px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="metal10" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f8f9fb" />
                      <stop offset="35%" stopColor="#cfd4da" />
                      <stop offset="55%" stopColor="#9aa3ad" />
                      <stop offset="75%" stopColor="#e9edf1" />
                      <stop offset="100%" stopColor="#b7bec7" />
                    </linearGradient>
                    <filter id="softShadow10" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="18" stdDeviation="18" floodOpacity="0.6" />
                    </filter>
                  </defs>
  
                  {/* “1” and “0” */}
                  <g filter="url(#softShadow10)" fill="url(#metal10)" stroke="#1b1f24" strokeWidth="6">
                    {/* 1 */}
                    <path d="M135 260 V70 l-55 25 v-48 l77-35 h32 v248z" />
                    {/* 0 */}
                    <path d="M380 30c62 0 100 55 100 120s-38 120-100 120-100-55-100-120 38-120 100-120zM380 72c-39 0-64 35-64 78s25 78 64 78 64-35 64-78-25-78-64-78z" />
                  </g>
                  <g fill="none" stroke="white" strokeOpacity="0.65" strokeWidth="2">
                    <path d="M135 260 V70 l-55 25" />
                    <path d="M380 60c-46 0-76 41-76 90s30 90 76 90" />
                  </g>
                </svg>
              </div>
  
              {/* Right: copy */}
              <div className="text-center lg:text-left">
                <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                  10 years of empowering traders,
                  <br className="hidden sm:block" />
                  and it&apos;s just the beginning.
                </h2>
  
                <p className="mt-4 text-white/80 text-lg sm:text-xl leading-relaxed">
                  Discover CNX markets&apos; transformed and enhanced trading experience.
                  Feel care that counts.
                </p>
  
                <div className="mt-6">
                  <a
                    href="/login"
                    className="inline-flex items-center rounded-full bg-[#18e25d] px-5 py-2 font-semibold text-black hover:opacity-90 transition"
                  >
                    Get started — log in
                    <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  