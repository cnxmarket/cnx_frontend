// src/api/deposit.js
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

  
export async function getCryptoMethods() {
  const r = await fetch(`${API_BASE}/api/deposit/crypto-methods/?online=1`, {
    headers: { Accept: "application/json", ...authHeader() },
    credentials: "include",
  });
  if (!r.ok) throw new Error("Failed to fetch deposit methods");
  return r.json();
}

// ⭐ UPDATED: create UPI request (user VPA + amount)
export async function createUpiRequest({ amount, payer_vpa, note }) {
  const r = await fetch(`${API_BASE}/api/deposit/upi/request/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    credentials: "include",
    body: JSON.stringify({ amount, payer_vpa, note }),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error(t || "Failed to create UPI request");
  }
  return r.json();
}


export async function listUpiRequests({ page = 1, page_size = 10 } = {}) {
    const url = new URL(`${API_BASE}/api/deposit/upi/requests/`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("page_size", String(page_size));
  
    const r = await fetch(url.toString(), {
      headers: { Accept: "application/json", ...authHeader() },
      credentials: "include",
    });
    return handleJson(r, "Failed to load UPI requests");
  }