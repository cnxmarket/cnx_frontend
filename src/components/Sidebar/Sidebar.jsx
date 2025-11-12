// src/components/Sidebar/Sidebar.jsx
import LivePrice from "../LivePrice";
import {
  HomeIcon,
  ClipboardListIcon,
  ViewGridIcon,
  LockClosedIcon,
  SupportIcon,
  MenuAlt2Icon,
  ChevronDoubleRightIcon,
  CurrencyDollarIcon,
  ArrowCircleUpIcon,
} from "@heroicons/react/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { logout as apiLogout } from "../../api/auth";

const pairs = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "USDCAD", "BTCUSDT", "XAUUSD", "NZDUSD"];

export default function Sidebar({ activePair, onSelect }) {
  const [railOpen, setRailOpen] = useState(false);     // mobile slide-out
  const [lgExpanded, setLgExpanded] = useState(false); // lg-only widen
  const [showPairs, setShowPairs] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Show labels if: mobile rail is open OR lg expanded (xl always wide via CSS)
  const showText = railOpen || lgExpanded;

  async function handleLogout() {
    try {
      await apiLogout();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  const isActive = (to) =>
    pathname === to || (to !== "/app" && pathname.startsWith(to));

  const navMain = useMemo(
    () => [
      { to: "/app", label: "Dashboard", icon: HomeIcon },
      { to: "/app/orders", label: "Order Table", icon: ClipboardListIcon },
      { to: "/app/positions", label: "Real-Time Positions", icon: ViewGridIcon },
      { to: "/app/profile", label: "Profile", icon: ViewGridIcon },
    ],
    []
  );

  // widths:
  // - mobile: hidden unless railOpen
  // - lg: icon rail (w-16) by default; can expand to w-64
  // - xl: always w-64
  const widthCls = `
    w-64
    lg:${lgExpanded ? "w-64" : "w-16"}
    xl:w-64
  `;

  return (
    <>
      {/* Overlay for mobile slide-out */}
      <div
        className={`fixed inset-0 bg-black/50 z-[80] lg:hidden transition-opacity ${
          railOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setRailOpen(false)}
      />

      {/* Mobile launcher (visible when rail is closed) */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setRailOpen(true)}
        className={`fixed left-3 top-3 z-[85] lg:hidden rounded-xl border border-white/10 
                    bg-[#0f1116]/90 p-2 text-white shadow-lg backdrop-blur 
                    ${railOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <MenuAlt2Icon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-[90] h-screen text-white
          border-r border-white/10 bg-[#0f1116]
          flex flex-col transition-[width,transform] duration-200 ease-out
          ${widthCls}
          ${railOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-[0_0_40px_rgba(0,0,0,.35)]
        `}
      >
        {/* Top bar */}
        <div className="relative flex items-center gap-3 border-b border-white/10 px-3 py-3 xl:px-5">
          {/* Mobile close */}
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10"
            onClick={() => setRailOpen(false)}
            aria-label="Close sidebar"
          >
            <MenuAlt2Icon className="h-6 w-6 text-white/90 rotate-180" />
          </button>

          {/* Brand (xl) */}
          <span className="hidden xl:block text-brand-green text-xl font-bold tracking-wide">
            CNX Markets
          </span>

          {/* lg-only expand/collapse */}
          <button
            type="button"
            onClick={() => setLgExpanded((v) => !v)}
            className="ml-auto hidden lg:flex xl:hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-white/70 hover:bg-white/[0.08]"
            title={lgExpanded ? "Collapse" : "Expand"}
          >
            <ChevronDoubleRightIcon
              className={`h-4 w-4 transition-transform ${lgExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Scroll area */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 xl:px-4">
          {/* Main nav */}
          <ul className="space-y-1">
            {navMain.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  title={n.label}
                  className={`
                    group flex items-center gap-3 rounded-xl px-2 py-2 xl:px-3
                    ${isActive(n.to) ? "bg-brand-green/15 text-white" : "hover:bg-white/5 text-white/80"}
                  `}
                  onClick={() => setRailOpen(false)}
                >
                  <n.icon className={`h-5 w-5 ${isActive(n.to) ? "text-brand-green" : "text-white/70"}`} />
                  <span className={`font-medium ${showText ? "inline" : "hidden xl:inline"}`}>
                    {n.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Funds */}
          <SectionLabel label="Funds" showText={showText} />
          <ul className="space-y-1">
            <li>
              <Link
                to="/app/deposit"
                title="Deposit"
                className={`
                  group flex items-center gap-3 rounded-xl px-2 py-2 xl:px-3
                  ${isActive("/app/deposit") ? "bg-brand-green/15 text-white" : "hover:bg-white/5 text-white/80"}
                `}
                onClick={() => setRailOpen(false)}
              >
                <CurrencyDollarIcon
                  className={`h-5 w-5 ${isActive("/app/deposit") ? "text-brand-green" : "text-white/70"}`}
                />
                <span className={`font-medium ${showText ? "inline" : "hidden xl:inline"}`}>Deposit</span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/withdraw"
                title="Withdraw"
                className={`
                  group flex items-center gap-3 rounded-xl px-2 py-2 xl:px-3
                  ${isActive("/app/withdraw") ? "bg-brand-green/15 text-white" : "hover:bg-white/5 text-white/80"}
                `}
                onClick={() => setRailOpen(false)}
              >
                <ArrowCircleUpIcon
                  className={`h-5 w-5 ${isActive("/app/withdraw") ? "text-brand-green" : "text-white/70"}`}
                />
                <span className={`font-medium ${showText ? "inline" : "hidden xl:inline"}`}>Withdraw</span>
              </Link>
            </li>
          </ul>

          {/* Authentication */}
          <SectionLabel label="Authentication" showText={showText} />
          <ul className="space-y-1">
            <RailItem
              icon={LockClosedIcon}
              label="Logout"
              onClick={handleLogout}
              showText={showText}
            />
          </ul>

          {/* Support */}
          <SectionLabel label="Support" showText={showText} />
          <ul className="space-y-1">
            <li>
              <Link
                to="/app/support"
                title="Support"
                className={`
                  group flex items-center gap-3 rounded-xl px-2 py-2 xl:px-3
                  ${isActive("/app/support") ? "bg-brand-green/15 text-white" : "hover:bg-white/5 text-white/80"}
                `}
                onClick={() => setRailOpen(false)}
              >
                <SupportIcon
                  className={`h-5 w-5 ${isActive("/app/support") ? "text-brand-green" : "text-white/70"}`}
                />
                <span className={`font-medium ${showText ? "inline" : "hidden xl:inline"}`}>Support</span>
              </Link>
            </li>
          </ul>
          {/* FX Pairs */}
          <div className="mt-6">
            <button
              onClick={() => setShowPairs((v) => !v)}
              className={`
                mb-2 w-full text-left text-[11px] uppercase tracking-wide font-semibold transition
                ${showText ? "text-white/70 block" : "text-white/50 hover:text-white/70 hidden xl:block"}
              `}
              title="Forex Pairs"
            >
              Forex Pairs
            </button>

            <div className={`${showPairs ? "block" : "hidden"} space-y-2`}>
              {pairs.map((p) => (
                <div
                  key={p}
                  onClick={() => onSelect?.(p)}
                  className={`cursor-pointer rounded-xl transition border border-white/5 
                              ${activePair === p ? "bg-brand-green/15" : "hover:bg-white/[0.06] bg-white/[0.03]"}`}
                  title={p}
                >
                  {/* Full LivePrice when we have room (lg expanded / xl) */}
                  <div className={`${lgExpanded ? "block" : "hidden"} xl:block`}>
                    <LivePrice symbol={p} />
                  </div>

                  {/* Compact row for mobile rail (not expanded) */}
                  <div className={`${lgExpanded ? "hidden" : "flex"} xl:hidden px-3 py-2 items-center justify-between`}>
                    <span className="text-sm font-semibold">{p}</span>
                    {activePair === p && (
                      <span className="rounded-md bg-brand-green/20 px-2 py-0.5 text-[11px] text-brand-green">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom mini brand strip (hidden on xl where header brand shows) */}
        <div className="mt-auto border-t border-white/10 px-2 py-3 xl:hidden">
          <div className="flex items-center justify-center">
            <span className="text-[10px] text-white/50">© {new Date().getFullYear()} CNX markets</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------- helpers ---------- */

function RailItem({ icon: Icon, label, onClick, showText }) {
  return (
    <li>
      <button
        onClick={onClick}
        title={label}
        className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 xl:px-3 hover:bg-white/5 text-white/80"
      >
        <Icon className="h-5 w-5 text-white/70" />
        <span className={`font-medium ${showText ? "inline" : "hidden xl:inline"}`}>{label}</span>
      </button>
    </li>
  );
}

function SectionLabel({ label, showText }) {
  return (
    <div className={`${showText ? "mt-6 block" : "mt-4 hidden xl:block"}`}>
      <div className="mb-2 text-[11px] font-semibold uppercase text-white/40">
        {label}
      </div>
    </div>
  );
}
