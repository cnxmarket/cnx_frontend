// src/components/home/ExploreFeatures.jsx
function Card({ children, className = "" }) {
    return (
      <div
        className={
          "relative overflow-hidden rounded-[28px] bg-[#0c0f15] border border-white/5 " +
          className
        }
      >
        {children}
      </div>
    );
  }
  
  function CTA() {
    return (
      <a
        href="/login"
        className="inline-flex items-center rounded-full bg-[#18e25d] px-5 py-2 text-sm font-semibold text-black shadow-sm hover:opacity-90 transition"
      >
        Get started
      </a>
    );
  }
  
  function LearnMore() {
    return (
      <a
        href="/login"
        className="inline-flex items-center text-sm font-semibold text-[#18e25d]"
      >
        Learn more
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
    );
  }
  
  export default function ExploreFeatures() {
    return (
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold">
            Explore trading <br className="hidden sm:block" />
            with risk-free instruments
          </h2>
  
          {/* Main feature card */}
          <Card className="mt-10 grid gap-6 p-6 sm:p-10 lg:grid-cols-2">
            {/* Left copy */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-semibold">
                Risk-free trading
              </h3>
              <p className="mt-2 text-white/70 max-w-sm">
                Trade with confidence — our risk-free system protects your
                capital, ensuring you never lose more than you invest.
              </p>
              <div className="mt-6">
                <CTA />
              </div>
              <div className="mt-3">
                <LearnMore />
              </div>
            </div>
  
            {/* Right image */}
            <div className="relative">
              <img
                src="/instruments_demo_bg.webp"
                alt="Risk-free trading"
                className="mx-auto max-h-[360px] w-auto object-contain"
              />
            </div>
  
            <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/5" />
          </Card>
  
          {/* Features grid */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Deposit bonus */}
            <Card className="p-6 sm:p-8">
              <div className="flex h-full flex-col">
                <h4 className="text-xl font-semibold">100% Deposit Bonus</h4>
                <p className="mt-1 text-white/70">
                  Deposit $100 and trade with <span className="font-semibold text-white">$200</span>.
                </p>
                <div className="mt-4">
                  <LearnMore />
                </div>
                <img
                  src="/images/feature-bonus.png"
                  alt="Deposit bonus"
                  className="mt-auto w-full rounded-2xl object-contain"
                />
              </div>
            </Card>
  
            {/* 0 spread brokerage */}
            <Card className="p-6 sm:p-8">
              <div className="flex h-full flex-col">
                <h4 className="text-xl font-semibold">0 Spread Brokerage</h4>
                <p className="mt-1 text-white/70">
                  Trade with transparent pricing and zero spread on all instruments.
                </p>
                <div className="mt-4">
                  <LearnMore />
                </div>
                <img
                  src="/images/feature-zero-spread.png"
                  alt="0 spread brokerage"
                  className="mt-auto w-full rounded-2xl object-contain"
                />
              </div>
            </Card>
  
            {/* Trade all forex pairs */}
            <Card className="p-6 sm:p-8">
              <div className="flex h-full flex-col">
                <h4 className="text-xl font-semibold">Trade All Forex Pairs</h4>
                <p className="mt-1 text-white/70">
                  Access major, minor, and exotic pairs directly from your account.
                </p>
                <div className="mt-4">
                  <LearnMore />
                </div>
                <img
                  src="/images/feature-forex.png"
                  alt="Trade all forex pairs"
                  className="mt-auto w-full rounded-2xl object-contain"
                />
              </div>
            </Card>
  
            {/* Negative balance protection */}
            {/* <Card className="p-6 sm:p-8">
              <div className="flex h-full flex-col">
                <h4 className="text-xl font-semibold">
                  Negative Balance Protection
                </h4>
                <p className="mt-1 text-white/70">
                  So you only risk your trade amount — never more.
                </p>
                <div className="mt-4">
                  <LearnMore />
                </div>
                <img
                  src="/images/feature-nbp.png"
                  alt="Negative balance protection"
                  className="mt-auto w-full rounded-2xl object-contain"
                />
              </div>
            </Card> */}
          </div>
        </div>
      </section>
    );
  }
  