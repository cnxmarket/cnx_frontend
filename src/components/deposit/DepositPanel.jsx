import { useEffect, useMemo, useState } from "react";
import { getCryptoMethods, createUpiRequest, listUpiRequests } from "../../api/deposit";
import {
  ClipboardCopyIcon,
  RefreshIcon,
  QrcodeIcon,
  BadgeCheckIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";

/* ------------------------------ small UI bits ------------------------------ */

function CopyBtn({ value, label = "Copy" }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1200);
        } catch {}
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08]"
    >
      <ClipboardCopyIcon className="h-4 w-4" />
      {ok ? "Copied" : label}
    </button>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

function EmptyState({ title, note }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-white/[0.06] flex items-center justify-center">
        <InformationCircleIcon className="h-6 w-6 text-white/60" />
      </div>
      <h4 className="mt-3 text-white font-medium">{title}</h4>
      {note && <p className="mt-1 text-sm text-white/60">{note}</p>}
    </div>
  );
}

/* -------------------------------- Component -------------------------------- */

export default function DepositPanel() {
  const [tab, setTab] = useState("crypto"); // 'crypto' | 'upi'
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState([]);
  const [err, setErr] = useState("");

  // UPI form
  const [amount, setAmount] = useState("");
  const [payerVpa, setPayerVpa] = useState("");
  const [note, setNote] = useState("");
  const [upiResult, setUpiResult] = useState(null); // response after create
  const minUpi = 5000;

  // UPI table
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [tableLoading, setTableLoading] = useState(false);

  async function loadMethods() {
    setErr("");
    setLoading(true);
    try {
      const data = await getCryptoMethods();
      setMethods(data || []);
    } catch (e) {
      setErr(e.message || "Could not load methods");
    } finally {
      setLoading(false);
    }
  }

  async function loadUpiRequests(nextPage = page) {
    setTableLoading(true);
    try {
      const data = await listUpiRequests({ page: nextPage, page_size: pageSize });
      setRows(data?.results || []);
      setCount(data?.count || 0);
      setPage(nextPage);
    } catch (e) {
      // show lightweight note but don't block
      console.error(e);
    } finally {
      setTableLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "crypto") {
      loadMethods();
    }
  }, [tab]);

  useEffect(() => {
    loadUpiRequests(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onlineMethods = useMemo(
    () => methods.filter((m) => (m.status || "online") === "online"),
    [methods]
  );

  async function handleCreateUpi(e) {
    e.preventDefault();
    setErr("");
    const amt = Number(amount || 0);
    if (!amt || amt < minUpi) {
      setErr(`Minimum amount is ₹${minUpi}`);
      return;
    }
    if (!payerVpa || !/^[a-z0-9.\-_]{2,}@[a-z]{2,}$/i.test(payerVpa.trim())) {
      setErr("Please enter a valid UPI ID (e.g., name@bank).");
      return;
    }
    setLoading(true);
    try {
      const res = await createUpiRequest({
        amount: amt,
        payer_vpa: payerVpa.trim(),
        note: note || undefined,
      });
      setUpiResult(res);
      // refresh table immediately to show new row on top (assuming backend orders by -created)
      await loadUpiRequests(1);
      // reset the form for another request
      setAmount("");
      setPayerVpa("");
      setNote("");
      // auto-switch to table view hint (stay in UPI tab)
    } catch (e2) {
      setErr(e2.message || "Failed to submit UPI request");
    } finally {
      setLoading(false);
      // hide transient success card after a few seconds
      setTimeout(() => setUpiResult(null), 3500);
    }
  }

  /* --------------------------------- render -------------------------------- */

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Deposit Funds</h1>
          <p className="text-white/60 text-sm">Add capital to your CNX markets account.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] p-1">
          {[
            { key: "crypto", label: "Crypto (USDT)" },
            { key: "upi", label: "UPI (India)" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.key ? "bg-brand-green text-black" : "text-white/75"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {err}
        </div>
      )}

      {/* Body */}
      {tab === "crypto" ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheckIcon className="h-5 w-5 text-brand-green" />
              <p className="text-sm text-white/70">
                Send only <span className="text-white font-semibold">USDT</span> to the matching network.
              </p>
            </div>
            <button
              onClick={loadMethods}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08]"
            >
              <RefreshIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loading && onlineMethods.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[0, 1].map((k) => (
                <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="h-40 w-full animate-pulse rounded-xl bg-white/5" />
                  <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : onlineMethods.length === 0 ? (
            <EmptyState title="No crypto methods online" note="Try again later or use the UPI option." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {onlineMethods.map((m) => (
                <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill>{m.name}</Pill>
                      {m.network && <Pill>{m.network}</Pill>}
                    </div>
                    <span className="text-xs text-white/50">
                      Min {m.min_amount ?? 0}{m.name === "USDT" ? " USDT" : ""}
                      {m.max_amount ? ` · Max ${m.max_amount}` : ""}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-4">
                    <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      {m.qr_url ? (
                        <img src={m.qr_url} alt={`${m.name} ${m.network} QR`} className="h-full w-full object-cover" />
                      ) : (
                        <QrcodeIcon className="h-16 w-16 text-white/15" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-xs uppercase text-white/50">Deposit Address</p>
                      <p className="break-all rounded-lg border border-white/10 bg-black/30 p-2 font-mono text-sm text-white">
                        {m.address}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <CopyBtn value={m.address} label="Copy address" />
                        {m.qr_url && (
                          <a
                            href={m.qr_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08]"
                          >
                            Open QR
                          </a>
                        )}
                      </div>
                      <p className="mt-2 text-[11px] leading-5 text-white/50">
                        ** Send only USDT on <span className="font-semibold text-white/70">{m.network}</span>. Sending
                        other coins or on wrong network may result in loss of funds.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-6">
          {/* Success toast-style card */}
          {upiResult && (
            <div className="rounded-xl border border-brand-green/30 bg-brand-green/10 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-brand-green/20 p-2">
                  <BadgeCheckIcon className="h-6 w-6 text-brand-green" />
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">UPI request submitted</p>
                  <p className="text-white/80 mt-0.5">
                    #{upiResult.id} · ₹{upiResult.amount} · {upiResult.payer_vpa}
                  </p>
                  <p className="text-white/60 mt-1">
                    We alerted our team. Make the transfer from the same UPI ID; funds will reflect after verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* UPI form */}
          <form onSubmit={handleCreateUpi} className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm text-white/70">Amount (₹)</label>
                  <input
                    type="number"
                    min={minUpi}
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                    placeholder={`Min ₹${minUpi}`}
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm text-white/70">Your UPI ID (VPA)</label>
                  <input
                    type="text"
                    value={payerVpa}
                    onChange={(e) => setPayerVpa(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                    placeholder="yourname@bank"
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm text-white/70">Note (optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                    placeholder="e.g. CNX top-up"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <InformationCircleIcon className="mt-[1px] h-5 w-5 text-white/50" />
                <p className="text-sm text-white/70">
                  We’ll notify our ops team instantly. After you make the transfer from this UPI ID, we’ll verify and
                  credit your account.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-brand-green px-5 py-2.5 font-medium text-black disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit UPI Request"}
              </button>
            </div>
          </form>

          {/* UPI history table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-white font-semibold">Your UPI deposit requests</h3>
              <button
                onClick={() => loadUpiRequests(page)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08]"
              >
                <RefreshIcon className={`h-4 w-4 ${tableLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-white/60">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">UPI ID</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tableLoading && rows.length === 0 ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={`sk-${i}`}>
                        {Array.from({ length: 7 }).map((__, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : rows.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6" colSpan={7}>
                        <EmptyState
                          title="No requests yet"
                          note="Your UPI deposit requests will appear here."
                        />
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id} className="text-white/85">
                        <td className="px-4 py-3 font-medium text-white">{r.id}</td>
                        <td className="px-4 py-3">₹{r.amount}</td>
                        <td className="px-4 py-3 font-mono">{r.payer_vpa}</td>
                        <td className="px-4 py-3">{r.note || "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs ${
                              r.status === "approved"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : r.status === "rejected"
                                ? "bg-red-500/15 text-red-300"
                                : "bg-yellow-500/15 text-yellow-300"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{new Date(r.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3">{new Date(r.updated_at).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* simple pager */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-white/70">
              <div className="text-xs">
                Page {page} of {Math.max(1, Math.ceil(count / pageSize))} · {count} total
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || tableLoading}
                  onClick={() => loadUpiRequests(page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08] disabled:opacity-40"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Prev
                </button>
                <button
                  disabled={page >= Math.ceil(count / pageSize) || tableLoading}
                  onClick={() => loadUpiRequests(page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08] disabled:opacity-40"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
