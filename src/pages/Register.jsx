// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import { ROUTES } from "../routes";
import AuthMiniFooter from "../components/common/AuthMiniFooter";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register({ username, email, password });
      navigate(`${ROUTES.kyc}?email=${encodeURIComponent(email)}`);
    } catch (e) {
      setErr(e.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  // light/grey inputs
  const inputBase =
  "w-full rounded-xl border border-slate-300 bg-white text-slate-900 " +
  "px-4 py-3 text-base leading-6 placeholder:text-slate-400 " +
  "appearance-none focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green/60";


  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <main className="flex-1 w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1">Register to continue to the platform.</p>
          </header>

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                     className={inputBase} placeholder="yourname" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                     className={inputBase} placeholder="you@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                     className={inputBase} placeholder="••••••••" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                     className={inputBase} placeholder="••••••••" required />
            </div>

            {err && (
              <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {err}
              </div>
            )}

            {/* ✅ always green CTA (no weird fallback) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg text-white font-medium transition-colors
                         bg-[linear-gradient(90deg,#16db5e_0%,#12c451_100%)]
                         hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <footer className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to={ROUTES.login} className="text-brand-green hover:opacity-90">
              Sign in
            </Link>
          </footer>
        </div>
      </main>

      <AuthMiniFooter />
    </div>
  );
}
