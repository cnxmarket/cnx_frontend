import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { kycStatus } from "../api/kyc"; // GET /api/kyc/status/

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("access");
  const [state, setState] = useState({ loading: true, allowed: false, kyc: "pending" });

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!token) {
        if (alive) setState({ loading: false, allowed: false, kyc: "none" });
        return;
      }
      try {
        const s = await kycStatus(token);
        const status = s?.status || "pending";
        if (alive) setState({
          loading: false,
          allowed: status === "approved",
          kyc: status
        });
      } catch {
        if (alive) setState({ loading: false, allowed: false, kyc: "pending" });
      }
    }
    run();
    return () => { alive = false; };
  }, [token]);

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

  if (state.loading) {
    return <div className="p-6 text-white">Checking access…</div>;
  }

  // If KYC not approved, send them to /kyc (public upload page)
  if (!state.allowed) {
    return <Navigate to="/kyc" replace />;
  }

  return children;
}
