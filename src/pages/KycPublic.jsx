// src/pages/KycPublic.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { submitKycPublic } from "../api/kyc";
import { ROUTES } from "../routes";
import AuthMiniFooter from "../components/common/AuthMiniFooter";

export default function KycPublic() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [aadhaar, setAadhaar] = useState("");
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // visual progress while submitting

  // success modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // same input style as Login/Register (padding-based)
  const inputBase =
    "w-full rounded-xl border border-slate-300 bg-white text-slate-900 " +
    "px-4 py-3 text-base leading-6 placeholder:text-slate-400 appearance-none " +
    "focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green/60";

  // simple masked Aadhaar display (#### #### ####)
  const maskedAadhaar = useMemo(() => {
    const s = aadhaar.replace(/\D/g, "").slice(0, 12);
    return s.replace(/(\d{4})(?=\d)/g, "$1 ");
  }, [aadhaar]);

  function pickFile(which) {
    const el = document.getElementById(which);
    if (el) el.click();
  }

  function onFileChange(e, setter) {
    const file = e.target.files?.[0] || null;
    setter(file);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setNote("");
    setLoading(true);
    setProgress(12);

    // lightweight fake progress while the request is in-flight
    let t = null;
    const tick = () => setProgress((p) => (p < 92 ? p + Math.random() * 6 : p));
    t = setInterval(tick, 300);

    try {
      await submitKycPublic({
        email,
        aadhaar: aadhaar.replace(/\s/g, ""),
        frontFile: front,
        backFile: back,
      });
      setProgress(100);
      // open success modal instead of inline note
      setSuccessMsg("✅ KYC submitted. You can log in after admin verification.");
      setShowSuccess(true);
    } catch (e) {
      setNote(e?.message || "KYC submit failed.");
    } finally {
      clearInterval(t);
      // give the bar a moment at 100% for nicer feel
      setTimeout(() => setLoading(false), 400);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100">
      <main className="flex-1 w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          {/* Top line: title + secure badge */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">KYC Verification</h1>
            <SecureBadge />
          </div>
          <p className="text-slate-500 text-sm mb-6">Verify your identity to start trading with CNX markets.</p>

          {/* progress bar when submitting */}
          {loading && (
            <div className="mb-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-brand-green transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500">Submitting documents…</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar number</label>
              <input
                type="text"
                inputMode="numeric"
                value={maskedAadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className={inputBase}
                maxLength={14} // 12 digits + 2 spaces
                placeholder="1234 5678 9012"
                required
              />
              <p className="mt-1 text-xs text-slate-500">We store it securely and never share with third parties.</p>
            </div>

            {/* Front image */}
            <UploadField
              id="kyc-front"
              label="Aadhaar Front"
              description="Clear photo of the card’s front"
              file={front}
              onPick={() => pickFile("kyc-front-input")}
              onChange={(e) => onFileChange(e, setFront)}
              disabled={loading}
            />

            {/* Back image */}
            <UploadField
              id="kyc-back"
              label="Aadhaar Back"
              description="Clear photo of the card’s back"
              file={back}
              onPick={() => pickFile("kyc-back-input")}
              onChange={(e) => onFileChange(e, setBack)}
              disabled={loading}
              back
            />

            <button
              type="submit"
              disabled={
                loading ||
                !email ||
                maskedAadhaar.replace(/\s/g, "").length !== 12 ||
                !front ||
                !back
              }
              className="w-full rounded-lg text-white font-medium transition-colors
                         bg-[linear-gradient(90deg,#16db5e_0%,#12c451_100%)]
                         px-4 py-3 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting…" : "Submit KYC"}
            </button>
          </form>

          {note && !showSuccess && (
            <p className="mt-4 text-sm text-slate-700">{note}</p>
          )}

          <p className="text-sm text-slate-600 mt-6">
            Once approved, you can{" "}
            <Link to={ROUTES.login} className="text-brand-green hover:opacity-90">
              log in here
            </Link>.
          </p>
        </div>
      </main>

      <AuthMiniFooter />

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          message={successMsg}
          onOk={() => navigate(ROUTES.login)}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}

/* ---------- modal (new) ---------- */

function SuccessModal({ message, onOk, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kyc-success-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="kyc-success-title" className="mb-2 text-lg font-semibold text-slate-900">
          KYC Submitted
        </h2>
        <p className="mb-6 text-slate-700">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onOk}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            OK
          </button>
          <button
            onClick={onOk}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- subcomponents ---------- */

function UploadField({ id, label, description, file, onPick, onChange, disabled, back = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>

      <div
        className="group relative flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-3 hover:border-slate-400"
        onClick={onPick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick()}
      >
        {/* Thumbnail / placeholder */}
        <div className="h-16 w-24 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 grid place-items-center">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <PlaceholderID back={back} />
          )}
        </div>

        <div className="flex-1">
          <div className="font-medium text-slate-800">Upload {back ? "back" : "front"} image</div>
          <div className="text-xs text-slate-500">{description}</div>
          <div className="mt-1 text-xs text-slate-400">JPG or PNG, up to 10 MB</div>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 group-hover:bg-slate-50">
            Choose file
          </span>
        </div>

        {/* Hidden input */}
        <input
          id={`${id}-input`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function PlaceholderID({ back = false }) {
  // simple crisp SVG placeholders for ID card (front/back)
  return (
    <svg viewBox="0 0 160 100" className="h-12 w-20 text-slate-300" aria-hidden="true">
      <rect x="2" y="2" width="156" height="96" rx="10" className="fill-none" stroke="currentColor" strokeWidth="4" />
      {!back ? (
        <>
          <circle cx="40" cy="50" r="18" fill="currentColor" />
          <rect x="70" y="30" width="70" height="12" rx="6" fill="currentColor" />
          <rect x="70" y="52" width="60" height="10" rx="5" fill="currentColor" opacity="0.6" />
        </>
      ) : (
        <>
          <rect x="20" y="24" width="120" height="18" rx="6" fill="currentColor" />
          <rect x="20" y="54" width="92" height="12" rx="6" fill="currentColor" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

function SecureBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600" fill="currentColor" aria-hidden="true">
        <path d="M12 2l7 3v6c0 5-3.4 9.4-7 11-3.6-1.6-7-6-7-11V5l7-3zm3.7 6.7l-4.2 4.2-1.7-1.7-1.4 1.4 3.1 3.1 5.6-5.6-1.4-1.4z" />
      </svg>
      <span className="text-xs font-medium text-emerald-800">Secure • Verified</span>
    </div>
  );
}
