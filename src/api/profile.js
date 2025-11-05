// src/api/profile.js
import { API_BASE } from "./config";

function authHeader() {
  const token = localStorage.getItem("access") || sessionStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMe() {
  const r = await fetch(`${API_BASE}/api/me/`, {
    headers: { Accept: "application/json", ...authHeader() },
    credentials: "include",
  });
  if (!r.ok) throw new Error("Failed to load profile");
  return r.json();
}

export async function updateMe(patch) {
  const r = await fetch(`${API_BASE}/api/me/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(patch),
    credentials: "include",
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || "Failed to update profile");
  }
  return r.json();
}

export async function changePassword({ old_password, new_password }) {
  const r = await fetch(`${API_BASE}/api/me/change_password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ old_password, new_password }),
    credentials: "include",
  });
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    const msg = data?.detail || data?.old_password?.[0] || "Password change failed";
    throw new Error(msg);
  }
  return r.json(); // {detail: "..."}
}
