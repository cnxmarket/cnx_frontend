import { API_BASE } from "./config";

export async function login({ username, password }) {
  const r = await fetch(`${API_BASE}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  let data = null;
  try { data = await r.json(); } catch { data = {}; }

  if (!r.ok) {
    // our serializer sends {code, message}
    const code = data?.code || "AUTH_FAILED";
    const message = data?.message || data?.detail || "Login failed";
    throw { code, message };
  }

  
  return data; // {access, refresh}
}


export async function refreshAccess() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh");
  const res = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ refresh })
  });
  if (!res.ok) throw new Error("Refresh failed");
  const { access } = await res.json();
  localStorage.setItem("access", access);
  return access;
}

export async function authFetch(input, init = {}) {
  // Allow passing either path ("/api/...") or full URL
  const url = typeof input === "string" && !/^https?:\/\//i.test(input)
    ? `${API_BASE}${input.startsWith("/") ? "" : "/"}${input}`
    : input;

  const headers = new Headers(init.headers || {});
  const access = localStorage.getItem("access");
  if (access) headers.set("Authorization", `Bearer ${access}`);
  let res = await fetch(url, { ...init, headers });
  if (res.status !== 401) return res;

  try {
    const newAccess = await refreshAccess();
    headers.set("Authorization", `Bearer ${newAccess}`);
    res = await fetch(url, { ...init, headers });
  } catch (_) {}
  return res;
}


export async function register({ username, email, password }) {
  const r = await fetch(`${API_BASE}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!r.ok) throw new Error("Registration failed");
  return r.json();
}

// src/api/kyc.js
export async function kycStatus(token) {
  const r = await fetch(`${API_BASE}/api/kyc/status/`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  return r.json();
}

export async function submitKyc({ token, aadhaar, frontFile, backFile }) {
  const fd = new FormData();
  fd.append("aadhaar_number", aadhaar);
  fd.append("doc_front", frontFile);
  fd.append("doc_back", backFile);
  const r = await fetch(`${API_BASE}/api/kyc/submit/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
    credentials: "include",
  });
  if (!r.ok) throw new Error("KYC submit failed");
  return r.json();
}


export async function logout() {
  const access  = localStorage.getItem("access")  || sessionStorage.getItem("access");
  const refresh = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");

  // tell backend to blacklist the refresh
  await fetch(`${API_BASE}/api/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body: JSON.stringify({ refresh }),
    credentials: "include",
  }).catch(() => {});

  // clear tokens (both stores, in case)
  localStorage.removeItem("access");  localStorage.removeItem("refresh");
  sessionStorage.removeItem("access"); sessionStorage.removeItem("refresh");
}