// src/hooks/useKycGate.jsx
import { useEffect, useState } from "react";
import { kycStatus } from "../api/kyc";

export function useKycGate(token) {
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (!token) return;
    kycStatus(token).then((s) => setStatus(s.status || "pending")).catch(() => setStatus("pending"));
  }, [token]);
  return status; // "approved" | "pending" | "rejected" | "loading"
}
