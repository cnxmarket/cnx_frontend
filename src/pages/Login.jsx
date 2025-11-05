// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../api/auth";
import { ROUTES } from "../routes";
import AuthMiniFooter from "../components/common/AuthMiniFooter";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false); // UI only
  const [loading, setLoading] = useState(false);

  const [err, setErr] = useState("");
  const [kycPending, setKycPending] = useState(false);
  const [kycRejected, setKycRejected] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setKycPending(false);
    setKycRejected(false);
    setLoading(true);

    try {
      const data = await login({ username: email, password });
      // store tokens in both stores
      for (const store of [localStorage, sessionStorage]) {
        store.setItem("access", data.access);
        store.setItem("refresh", data.refresh);
      }
      const to = location.state?.from?.pathname || ROUTES.home;
      navigate(to, { replace: true });
    } catch (e) {
      const code = e?.code || "AUTH_FAILED";
      if (code === "KYC_PENDING") {
        setKycPending(true);
        setErr("Your KYC is under review.");
      } else if (code === "KYC_REJECTED") {
        setKycRejected(true);
        setErr("Your KYC was rejected.");
      } else {
        setErr("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  }

  // same field style as Register (no fixed height; clean inner padding)
  const inputBase =
    "w-full rounded-xl border border-slate-300 bg-white text-slate-900 " +
    "px-4 py-3 text-base leading-6 placeholder:text-slate-400 appearance-none " +
    "focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green/60";

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      {/* main card */}
      <main className="flex-1 w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Let’s Get Started</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue.</p>
          </header>

          {kycPending && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-3 py-2">
              Your KYC is under review.&nbsp;
              <Link
                to={`${ROUTES.kyc}?email=${encodeURIComponent(email)}`}
                className="underline font-medium"
              >
                View / resubmit KYC
              </Link>
            </div>
          )}

          {kycRejected && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              Your KYC was rejected. Please resubmit your documents.&nbsp;
              <Link
                to={`${ROUTES.kyc}?email=${encodeURIComponent(email)}`}
                className="underline font-medium"
              >
                Resubmit KYC
              </Link>
            </div>
          )}

          {err && !kycPending && !kycRejected && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {err}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email / Username</label>
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBase}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-green focus:ring-brand-green"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                />
                Remember password
              </label>
              <button
                type="button"
                onClick={() => alert("Contact Administrator to reset password.")}
                className="text-sm text-brand-green hover:opacity-90"
              >
                Forgot password?
              </button>
            </div>

            {/* green CTA to match Register */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg text-white font-medium transition-colors
                         bg-[linear-gradient(90deg,#16db5e_0%,#12c451_100%)]
                         px-4 py-3 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <footer className="text-center text-sm text-slate-600 my-6">
            Don’t have an account?{" "}
            <Link to={ROUTES.register} className="text-brand-green hover:opacity-90">
              Create Account
            </Link>
          </footer>
        </div>
      </main>

      {/* mini footer (same as Register) */}
      <AuthMiniFooter />
    </div>
  );
}
