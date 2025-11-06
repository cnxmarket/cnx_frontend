// src/api/withdraw.js
import { API_BASE } from "./config";

function authHeader() {
  const token = localStorage.getItem("access") || sessionStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJson(r, fallbackMsg = "Request failed") {
  const ct = r.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const body = isJson ? await r.json().catch(() => ({})) : await r.text().catch(() => "");
  if (!r.ok) {
    const msg =
      (isJson && (body?.detail || body?.message)) ||
      (typeof body === "string" && body) ||
      fallbackMsg;
    const err = new Error(msg);
    err.status = r.status;
    err.body = body;
    throw err;
  }
  return body;
}

/**
 * Create a withdrawal request for the authenticated user
 * Body: { amount }
 */
export async function createWithdrawal({ amount }) {
  const r = await fetch(`${API_BASE}/api/withdrawals/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    credentials: "include",
    body: JSON.stringify({ amount }),
  });
  return handleJson(r, "Failed to create withdrawal request");
}

/**
 * List withdrawal requests for the authenticated user (paginated if backend supports)
 */
export async function listWithdrawals({ page = 1, page_size = 10 } = {}) {
  const url = new URL(`${API_BASE}/api/withdrawals/`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(page_size));
  const r = await fetch(url.toString(), {
    headers: { Accept: "application/json", ...authHeader() },
    credentials: "include",
  });
  return handleJson(r, "Failed to load withdrawals");
}

/**
 * Get a single withdrawal (optional helper)
 */
export async function getWithdrawal(id) {
  const r = await fetch(`${API_BASE}/api/withdrawals/${id}/`, {
    headers: { Accept: "application/json", ...authHeader() },
    credentials: "include",
  });
  return handleJson(r, "Failed to load withdrawal");
}
