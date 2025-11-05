// src/api/kyc.js
import { API_BASE } from "./config";

// Get current user's KYC status (requires JWT access token)
export async function kycStatus(token) {
  const r = await fetch(`${API_BASE}/api/kyc/status/`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!r.ok) throw new Error("Failed to fetch KYC status");
  return r.json(); // { status: "approved" | "pending" | "rejected", ... }
}

// Submit KYC when already logged in (optional)
export async function submitKyc({ token, aadhaar, frontFile, backFile }) {
  const fd = new FormData();
  fd.append("aadhaar_number", aadhaar);
  fd.append("doc_front", frontFile);
  fd.append("doc_back", backFile);

  const r = await fetch(`${API_BASE}/api/kyc/submit/`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: fd,
    credentials: "include",
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || "KYC submit failed");
  }
  return r.json();
}

// Public KYC submit (before login)
export async function submitKycPublic({ email, aadhaar, frontFile, backFile }) {
  const fd = new FormData();
  fd.append("email", email);
  fd.append("aadhaar_number", aadhaar);
  fd.append("doc_front", frontFile);
  fd.append("doc_back", backFile);

  const r = await fetch(`${API_BASE}/api/kyc/submit_public/`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || "KYC submit failed");
  }
  return r.json();
}
