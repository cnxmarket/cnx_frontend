// src/api/adminTrades.js
import { API_BASE } from "./config";

export async function listMyAdminTrades() {
  const token = localStorage.getItem("access");
  const r = await fetch(`${API_BASE}/api/admin_trades/`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!r.ok) throw new Error("Failed to load admin trades");
  return r.json();
}
