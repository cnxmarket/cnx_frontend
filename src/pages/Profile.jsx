import { useEffect, useMemo, useState } from "react";

// 👇 Adjust these to your API layer names if different
import { getMe, updateMe, changePassword } from "../api/profile"; // <- implement in your api if not present

/* ------------------------------ Page ------------------------------ */

export default function Profile() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // editable names
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");

  // save states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // password section
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");

  // fetch me
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMe(); // { id, username, email, first_name, last_name, full_name, kyc_status, aadhaar_last4, profile:{avatar_url} }
        if (!mounted) return;
        setMe(res);
        setFirstName(res.first_name || "");
        setLastName(res.last_name || "");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const avatarUrl = useMemo(() => {
    if (me?.profile?.avatar_url) return me.profile.avatar_url;
    // letters fallback
    const initials =
      (me?.full_name || me?.username || "CNX")
        .split(" ")
        .map((p) => p[0]?.toUpperCase())
        .slice(0, 2)
        .join("") || "CN";
    // tiny svg data-url avatar
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
        <rect width="100%" height="100%" rx="12" fill="#0f1116"/>
        <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Inter,system-ui,Arial" font-size="40" fill="white" opacity=".9">${initials}</text>
      </svg>
    `)}`;
  }, [me]);

  function openConfirm(e) {
    e?.preventDefault();
    setSaveMsg("");
    setConfirmOpen(true);
  }

  async function onConfirmSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const updated = await updateMe({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      setMe((m) => ({ ...(m || {}), ...updated }));
      setSaveMsg("Profile updated successfully.");
    } catch (e) {
      setSaveMsg(e?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  }

  async function onChangePassword(e) {
    e.preventDefault();
    setPwdSaving(true);
    setPwdMsg("");
    try {
      await changePassword({ old_password: oldPwd, new_password: newPwd });
      setPwdMsg("Password updated successfully.");
      setOldPwd("");
      setNewPwd("");
    } catch (e2) {
      setPwdMsg(e2?.message || "Failed to update password.");
    } finally {
      setPwdSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-white/70">Loading profile…</div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      {saveMsg && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            /success|updated/i.test(saveMsg)
              ? "border-brand-green/30 bg-brand-green/10 text-brand-green"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {saveMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Summary */}
        <section className="lg:col-span-4">
          <div className="rounded-xl border border-white/10 bg-[#131820] shadow-[0_10px_30px_rgba(0,0,0,.25)] p-6 h-full">
            <header className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"
                />
                {String(me?.kyc_status).toLowerCase() === "approved" && (
                  <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-green ring-2 ring-[#131820]">
                    <svg viewBox="0 0 20 20" className="h-3 w-3 text-black" fill="currentColor">
                      <path d="M8 13.2l-2.6-2.6L4 12l4 4 8-8-1.4-1.4z" />
                    </svg>
                  </span>
                )}
              </div>
              <div>
                <div className="text-lg font-semibold">{me?.full_name || me?.username}</div>
                <div className="text-white/60 text-sm">{me?.email}</div>
                <div className="mt-2">
                  <KycBadge status={me?.kyc_status} />
                </div>
              </div>
            </header>

            <div className="mt-6 space-y-4">
              <InfoRow label="Username" value={me?.username || "—"} />
              <InfoRow label="Email" value={me?.email || "—"} />
              <InfoRow label="Aadhaar last 4" value={me?.aadhaar_last4 || "—"} />
            </div>
          </div>
        </section>

        {/* RIGHT: Content stack */}
        <section className="lg:col-span-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Personal details */}
          <div className="xl:col-span-7">
            <div className="rounded-xl border border-white/10 bg-[#131820] shadow-[0_10px_30px_rgba(0,0,0,.25)] p-6 h-full">
              <header>
                <h2 className="text-lg font-semibold">Personal details</h2>
                <p className="text-sm text-white/60 mt-1">
                  Update your name as it should appear on statements.
                </p>
              </header>

              <form className="mt-5 space-y-5" onSubmit={openConfirm}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                  <Field
                    label="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-green px-4 py-2 font-medium text-black hover:opacity-90"
                  >
                    Save changes
                  </button>
                  <span className="text-xs text-white/50">You’ll be asked to confirm before saving.</span>
                </div>
              </form>
            </div>
          </div>

          {/* Change password */}
          <div className="xl:col-span-5">
            <div className="rounded-xl border border-white/10 bg-[#131820] shadow-[0_10px_30px_rgba(0,0,0,.25)] p-6 h-full">
              <header>
                <h2 className="text-lg font-semibold">Change password</h2>
                <p className="text-sm text-white/60 mt-1">
                  Keep your account secure with a strong password.
                </p>
              </header>

              <form className="mt-5 space-y-4" onSubmit={onChangePassword}>
                <Field
                  label="Current password"
                  type="password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  placeholder="••••••••"
                />
                <Field
                  label="New password"
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Strong new password"
                />
                <button
                  type="submit"
                  disabled={pwdSaving}
                  className="rounded-lg bg-brand-green px-4 py-2 font-medium text-black hover:opacity-90 disabled:opacity-60"
                >
                  {pwdSaving ? "Updating…" : "Update password"}
                </button>
                {pwdMsg && (
                  <div
                    className={`text-sm ${
                      /updated/i.test(pwdMsg) ? "text-brand-green" : "text-red-400"
                    }`}
                  >
                    {pwdMsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation modal */}
      {confirmOpen && (
        <ConfirmModal
          saving={saving}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={onConfirmSave}
          firstName={firstName}
          lastName={lastName}
        />
      )}
    </div>
  );
}

/* ---------------------------- Subcomponents ---------------------------- */

function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-white placeholder-white/40
                   focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:border-transparent"
      />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-white/45">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

function KycBadge({ status }) {
  const s = String(status || "").toLowerCase();
  if (!s) return null;
  const map = {
    approved: { text: "KYC Verified", tone: "bg-brand-green/15 text-brand-green", dot: "bg-brand-green" },
    pending:  { text: "KYC Pending",  tone: "bg-yellow-500/15 text-yellow-300",   dot: "bg-yellow-400" },
    rejected: { text: "KYC Rejected", tone: "bg-red-500/15 text-red-300",         dot: "bg-red-400" },
  };
  const t = map[s] || map.pending;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${t.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {t.text}
    </span>
  );
}

function ConfirmModal({ saving, onCancel, onConfirm, firstName, lastName }) {
  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#10141b] p-6 shadow-xl">
        <h3 className="text-lg font-semibold">Confirm changes</h3>
        <p className="mt-2 text-white/70 text-sm">
          Save these personal details?
        </p>

        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/60">First name</span>
            <span className="font-medium">{firstName || "—"}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-white/60">Last name</span>
            <span className="font-medium">{lastName || "—"}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-white/80 hover:bg-white/[0.08]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="rounded-lg bg-brand-green px-4 py-2 font-medium text-black hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Confirm & save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Notes -------------------------------
- Buttons follow the theme: bg-brand-green text-black.
- Inputs use bg-white/[0.03] with brand-green focus ring.
- Layout: 2-column (summary left, content right). Stacks on mobile.
- Replace `getMe`, `updateMe`, `updatePassword` with your actual API calls.
----------------------------------------------------------------------- */
