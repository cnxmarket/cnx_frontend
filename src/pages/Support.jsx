// src/pages/Support.jsx
import { useMemo, useState } from "react";

const SUPPORT_EMAIL = "support@cnxmarkets.com"; // change if needed

export default function Support() {
  const [topic, setTopic] = useState("Account / KYC");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");

  const disabled = !subject.trim() || !message.trim();

  const mailtoHref = useMemo(() => {
    const lines = [
      message.trim(),
      "",
      "—",
      "Meta",
      `Topic: ${topic}`,
      email.trim() ? `Reply-to: ${email.trim()}` : null,
      reference.trim() ? `Reference: ${reference.trim()}` : null,
      "App: CNX Markets Dashboard",
    ].filter(Boolean);

    const body = encodeURIComponent(lines.join("\n"));
    const subj = encodeURIComponent(subject.trim());
    return `mailto:${SUPPORT_EMAIL}?subject=${subj}&body=${body}`;
  }, [topic, subject, message, email, reference]);

  function handleSubmit(e) {
    e.preventDefault();
    window.location.href = mailtoHref;
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header (same pattern as Withdraw/Deposit) */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-white">Support</h1>
        <p className="text-white/60 text-sm">
          Have a question or issue? Send us an email and our team will get back to you.
        </p>
      </div>

      {/* Form card (same card styles) */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-white/90">Topic</label>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option>Account / KYC</option>
                <option>Deposits / Withdrawals</option>
                <option>Trading / Orders</option>
                <option>Charts / Data</option>
                <option>Bug report</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-white/90">Your email (optional)</label>
              <input
                type="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/90">Subject</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Short summary"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={120}
            />
            <div className="mt-1 text-right text-xs text-white/50">{subject.length}/120</div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/90">Message</label>
            <textarea
              className="min-h-[140px] w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the issue or question…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={4000}
            />
            <div className="mt-1 text-right text-xs text-white/50">{message.length}/4000</div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/90">Reference (optional)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Order ID / Ticket / Screen"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={disabled}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              title={disabled ? "Add a subject and message" : "Open email app"}
            >
              Open Email
            </button>

            <div className="text-xs text-white/60">
              Emails go to <span className="font-medium text-white">{SUPPORT_EMAIL}</span>
            </div>
          </div>
        </form>

        <div className="mt-6 text-xs text-white/50">
          Tip: If your email app doesn’t open, ensure you have a default mail client set, or copy the text into your
          email manually.
        </div>
      </div>
    </section>
  );
}
