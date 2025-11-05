// src/api/trading.js
import { authFetch } from "../api/auth";
import { apiUrl } from "./url";

export async function placeFill({ symbol, side, lots, price, leverage }) {
  const res = await authFetch(apiUrl("/api/sim/fill"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, side, lots, price, leverage }) // leverage added here
  });
  if (!res.ok) throw new Error("Order rejected");
  return res.json();
}

export async function closePosition({ symbol, lots }) {
  const res = await authFetch(apiUrl("/api/positions/close"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lots ? { symbol, lots } : { symbol })
  });
  if (!res.ok) throw new Error("Close rejected");
  return res.json();
}

export async function listOrders({ symbol } = {}) {
  const url = symbol ? apiUrl(`/api/orders?symbol=${encodeURIComponent(symbol)}`) : apiUrl("/api/orders");
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Orders fetch failed");
  return res.json();
}

export async function listFills({ symbol } = {}) {
  const url = symbol ? apiUrl(`/api/fills?symbol=${encodeURIComponent(symbol)}`) : apiUrl("/api/fills");
  const res = await authFetch(url);
  if (!res.ok) throw new Error("Fills fetch failed");
  return res.json();
}

export async function fetchOrderHistory() {
  const url = apiUrl("/api/orderhistory/");
  const res = await authFetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Order history fetch failed");
  return await res.json();
}