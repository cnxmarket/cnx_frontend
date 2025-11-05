// src/components/home/ModernPlatform.jsx
export default function ModernPlatform() {
    return (
      <section className="relative bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          {/* Section heading */}
          <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold">
            Modern trading platform
          </h2>
  
          {/* Main layout */}
          <div className="relative mt-16 flex flex-col items-center justify-center lg:flex-row lg:justify-center">
            {/* Left text block */}
            <div className="mb-10 lg:mb-0 lg:mr-16 text-center lg:text-left">
              <p className="text-xl font-medium leading-snug text-white">
                Your financial future <br /> is in your hands
              </p>
              <a
                href="/login"
                className="mt-3 inline-flex items-center text-[#18e25d] font-semibold hover:text-[#14b84d] transition"
              >
                Get started — log in to trade
                <svg
                  className="ml-1 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
  
            {/* Right image */}
            <div className="relative">
              <img
                src="/phone.png"
                alt="Trading platform preview"
                className="mx-auto w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] xl:w-[480px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
  