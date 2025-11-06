import { useEffect, useMemo, useState } from "react";
import { createWithdrawal, listWithdrawals } from "../../api/withdraw";
import {
  RefreshIcon,
  InformationCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";

/* -------------------------------- helpers -------------------------------- */
function StatusBadge({ status }) {
  const map = {
    approved: "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20",
    rejected: "bg-red-400/15 text-red-300 ring-1 ring-red-400/20",
    created: "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20",
  };
  const label = status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Created";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.created}`}>
      {label}
    </span>
  );
}

function fmtAmount(v) {
  if (v === null || v === undefined) return "0.00";
  const n = Number(v);
  return Number.isNaN(n) ? String(v) : n.toFixed(2);
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (_) {
    return iso;
  }
}

function normalizeApiError(e) {
  if (!e) return "Something went wrong";
  if (typeof e === "string") return e;
  if (Array.isArray(e)) return e.join(", ");
  if (e.detail) return typeof e.detail === "string" ? e.detail : JSON.stringify(e.detail);
  const msgs = [];
  for (const k of Object.keys(e)) {
    const v = e[k];
    if (typeof v === "string") msgs.push(v);
    else if (Array.isArray(v)) msgs.push(v.join(", "));
    else msgs.push(JSON.stringify(v));
  }
  return msgs.join(" | ");
}

/* ------------------------------ main component ----------------------------- */
export default function WithdrawlPanel() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");

  // table state
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [count, setCount] = useState(0);

  // for showing how we auth (parity with deposit panel style)
  const authHeaders = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    const token = localStorage.getItem("access") || localStorage.getItem("token");
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }, []);

  async function loadWithdrawals(nextPage = page) {
    setTableLoading(true);
    setErr("");
    try {
      const data = await listWithdrawals({ page: nextPage, page_size: pageSize });
      const results = Array.isArray(data) ? data : data.results || [];
      setRows(results);
      setCount(data?.count ?? results.length);
      setPage(nextPage);
    } catch (e) {
      setErr(normalizeApiError(e.body || e));
    } finally {
      setTableLoading(false);
    }
  }

  useEffect(() => {
    loadWithdrawals(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const amt = parseFloat(String(amount).trim());
    if (!Number.isFinite(amt) || amt <= 0) {
      setErr("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      await createWithdrawal({ amount: amt.toFixed(2) });
      setSuccess("Withdrawal request created.");
      setAmount("");
      await loadWithdrawals(1);
      // hide transient success after a short delay
      setTimeout(() => setSuccess(""), 2500);
    } catch (e) {
      setErr(normalizeApiError(e.body || e));
    } finally {
      setLoading(false);
    }
  }

  /* --------------------------------- render -------------------------------- */
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Withdraw Funds</h1>
          <p className="text-white/60 text-sm">Request a payout from your CNX markets account.</p>
        </div>
        <button
          onClick={() => loadWithdrawals(page)}
          className="inline-flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08]"
        >
          <RefreshIcon className={`h-4 w-4 ${tableLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white/80">
        <InformationCircleIcon className="h-5 w-5 flex-none text-white/60" />
        <p className="text-sm">
          You can request any amount up to your available capital. An admin will review and either approve or
          reject your request. If rejected, the reason will appear in the table below.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 mb-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Amount</label>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-xl bg-white/[0.06] px-3 text-white/70">₹</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="mt-1 text-xs text-white/60">Amount cannot exceed your available capital.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Request Withdrawal"}
            </button>
            {success && <span className="text-emerald-300 text-sm">{success}</span>}
            {err && <span className="text-red-300 text-sm">{err}</span>}
          </div>
        </form>
      </div>

      {/* History table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-white font-semibold">Your withdrawal requests</h3>
          <div className="text-xs text-white/60">
            Page {page} of {Math.max(1, Math.ceil(count / pageSize))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-white/70">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Comment</th>
                <th className="px-4 py-3 font-medium">Requested</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-white/60">No withdrawal requests yet.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-white/10 text-white/90">
                    <td className="px-4 py-3">#{r.id}</td>
                    <td className="px-4 py-3">₹ {fmtAmount(r.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      {r.status === "rejected" && r.comment ? (
                        <span className="inline-block max-w-xs align-top text-white/80">{r.comment}</span>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/70">{fmtDate(r.created_at)}</td>
                    <td className="px-4 py-3 text-white/70">{fmtDate(r.updated_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <div className="text-xs text-white/60">
            Showing {rows.length} of {count} records
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || tableLoading}
              onClick={() => loadWithdrawals(page - 1)}
              className="inline-flex items-center gap-1 rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08] disabled:opacity-40"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Prev
            </button>
            <button
              disabled={page >= Math.ceil(count / pageSize) || tableLoading}
              onClick={() => loadWithdrawals(page + 1)}
              className="inline-flex items-center gap-1 rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08] disabled:opacity-40"
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
