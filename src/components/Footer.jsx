// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaYoutube } from "react-icons/fa";

const col = "space-y-3";
const item = "text-sm text-white/70 hover:text-white transition";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Social */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold mb-3">Follow us on social media</h3>
            <div className="flex items-center gap-3">
              <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 hover:border-white">
                <FaFacebookF />
              </a>
              <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 hover:border-white">
                <FaInstagram />
              </a>
              <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 hover:border-white">
                <FaTelegramPlane />
              </a>
              <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 hover:border-white">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Trading */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold mb-4">Trading</h3>
            <ul className={col}>
              <li><Link to="/home#markets" className={item}>Forex</Link></li>
              <li><Link to="/home#withdrawals" className={item}>Withdrawals</Link></li>
              <li><Link to="/home#features" className={item}>0 spread brokerage</Link></li>
              <li><Link to="/home#features" className={item}>100% deposit bonus</Link></li>
              <li><Link to="/home#features" className={item}>Trade all major pairs</Link></li>
              <li><Link to="/home#features" className={item}>Negative balance protection</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold mb-4">About</h3>
            <ul className={col}>
              <li><a href="#" className={item}>Social media</a></li>
              <li><a href="#" className={item}>Contacts</a></li>
              <li><a href="#" className={item}>News</a></li>
              <li><a href="#" className={item}>Affiliates</a></li>
              <li><a href="#" className={item}>Reviews</a></li>
            </ul>
          </div>

          {/* CTA (QR block alternative) */}
          <div className="md:col-span-3">
            <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 border border-white/10">
              <div className="h-14 w-14 rounded-md bg-white/90 text-black grid place-items-center text-xs font-bold">
                QR
              </div>
              <div>
                <div className="font-semibold leading-tight">
                  Financial future <br /> in your hands
                </div>
                <Link to="/login" className="mt-2 inline-flex items-center text-[#18e25d] font-semibold">
                  Get started — log in
                  <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Download / Help rows */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold mb-4">Download App</h3>
            <ul className={col}>
              <li><a href="#" className={item + " opacity-50 cursor-not-allowed"}>iOS (coming soon)</a></li>
              <li><a href="#" className={item + " opacity-50 cursor-not-allowed"}>Android (coming soon)</a></li>
              <li><Link to="/login" className={item}>Web App (login)</Link></li>
              <li><Link to="/login" className={item}>Desktop (web)</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold mb-4">Help</h3>
            <ul className={col}>
              <li><a href="#" className={item}>FAQ</a></li>
              <li><a href="#" className={item}>Support</a></li>
              <li><a href="#" className={item}>Learning Center</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/10" />

        {/* Copyright & legal */}
        <div className="space-y-6">
          <div className="text-sm text-white/60">© 2014–2025 <span className="font-semibold">CNX markets</span></div>

          <p className="text-[12px] leading-6 text-white/50">
            Trading involves substantial risk. You may lose some or all of your invested capital. Before trading, 
            consider your level of experience and investment objectives, and seek independent advice if necessary.
            Services may be provided by regional partners subject to local regulations.
          </p>

          <div className="flex flex-wrap gap-6 text-[12px] text-white/60">
            <a href="#" className="hover:text-white">Legal information</a>
            <a href="#" className="hover:text-white">Regulation</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
