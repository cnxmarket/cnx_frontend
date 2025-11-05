// src/components/home/Payments.jsx
import UpiLogo from "./payments/UpiLogo";
import NetBankingLogo from "./payments/NetBankingLogo";
import UsdtLogo from "./payments/UsdtLogo";

const METHODS = [
  { key: "upi",        svg: <UpiLogo className="h-14 w-auto" />,        title: "UPI" },
  { key: "netbanking", svg: <NetBankingLogo className="h-14 w-auto" />, title: "Net Banking" },
  { key: "usdtbep",    svg: <UsdtLogo className="h-14 w-auto" />,       title: "tether (USDT BEP20)" },
];

function Card({ method, i }) {
  const rotate = [-10, -6, -2, 2, 6, 10][i % 6];
  const shift  = [-10, -6, -2, 2, 6, 10][i % 6];

  return (
    <div
      className="
        relative h-64 w-48 shrink-0 overflow-hidden rounded-[28px]
        border border-white/10 bg-[#0c0f15]
        shadow-[0_25px_80px_rgba(0,0,0,.45)]
        transition will-change-transform
        hover:-translate-y-1 hover:shadow-[0_35px_90px_rgba(0,0,0,.6)]
      "
      style={{ transform: `rotate(${rotate}deg) translateY(${shift}px)` }}
      title={method.title}
    >
      {/* soft glossy vignette */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(100%_60%_at_50%_0%,rgba(255,255,255,.06),transparent)]" />

      {/* center the logo */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {method.svg}
      </div>
    </div>
  );
}

export default function Payments() {
  return (
    <section className="relative bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Quick <span className="text-[#18e25d]">withdrawal</span>
            <br />
            with local payment options
          </h2>
        </div>

        {/* Deck of cards */}
        <div className="mt-14 flex items-end justify-center gap-4 overflow-x-auto px-2 pb-3 lg:overflow-visible">
          {METHODS.map((m, i) => (
            <Card key={m.key} method={m} i={i} />
          ))}
        </div>

        {/* Optional: very small mobile fallback grid without fan effect */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:hidden">
          {METHODS.map((m) => (
            <div
              key={`${m.key}-grid`}
              className="flex h-28 items-center justify-center rounded-2xl border border-white/10 bg-[#0c0f15]"
              title={m.title}
            >
              {m.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
