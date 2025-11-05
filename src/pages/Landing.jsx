import Navbar from "../components/Navbar";
import Anniversary from "../components/home/Anniversary";
import ModernPlatform from "../components/home/ModernPlatform";
import ExploreFeatures from "../components/home/ExploreFeatures";
import Payments from "../components/home/Payments";
import Footer from "../components/Footer";


export default function Landing() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden pt-24">
                {/* Tall soft bars in the bg (right side) */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute right-6 top-24 h-[520px] w-28 rounded-3xl bg-white/5 blur-[1px]" />
                    <div className="absolute right-40 top-52 h-[460px] w-28 rounded-3xl bg-white/5" />
                    <div className="absolute right-80 top-16 h-[660px] w-28 rounded-3xl bg-white/5" />
                    <div className="absolute right-[28rem] top-40 h-[540px] w-28 rounded-3xl bg-white/5" />
                </div>

                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        {/* Left copy */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Build confidence
                                <br />
                                with every single trade
                            </h1>

                            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                                <button className="rounded-full px-6 py-3 text-base font-medium bg-[#18e25d] text-black hover:opacity-90 transition">
                                    Start now for $0
                                </button>

                                <a href="#learn" className="inline-flex items-center gap-2 text-base text-white/80 hover:text-white">
                                    Learn more
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-[1px]">
                                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>

                            {/* Badges row */}
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                {[
                                    "Modern platform",
                                    "Useful features",
                                    "Easy start",
                                    "Learning center",
                                    "Quick withdrawals",
                                    "Trusted broker",
                                ].map((t) => (
                                    <span key={t} className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/80">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right side hero person (placeholder block now) */}
                        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
                            {/* Dark card behind the photo */}
                            <div className="absolute inset-0 rounded-3xl bg-white/5" />

                            {/* Actual image (from public/heroimage.png) */}
                            <img
                                src="/heroimage.png"
                                alt="Trader using CNX markets platform"
                                className="relative z-10 h-full w-full rounded-3xl object-cover select-none pointer-events-none
               shadow-[0_30px_80px_rgba(0,0,0,.45)]"
                                loading="eager"
                            />

                            {/* Optional soft top fade for polish */}
                            <div className="pointer-events-none absolute inset-0 rounded-3xl 
                  bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            <Anniversary />

            <ModernPlatform />
            <ExploreFeatures />

            <Payments />
            <Footer />

        </div>
    );
}
