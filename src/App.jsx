// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import OrderTable from "./components/OrderTable";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

import { useCapitalStream } from "./hooks/useCapitalStream";
import { CapitalContext } from "./context/CapitalContext";
import PositionsTable from "./components/Tables/PositionsTable";
import OrderHistoryTable from "./components/Tables/OrderHistory";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";

import Register from "./pages/Register";
import KycPublic from "./pages/KycPublic";
import DepositPanel from "./components/deposit/DepositPanel";
// NOTE: matches the file we created: src/components/withdraw/withdrawpanel.js
import WithdrawlPanel from "./components/withdraw/WithdrawPanel";
import Support from "./pages/Support";


function AppShell() {
  const [symbol, setSymbol] = useState("EURUSD");
  const [capital, refreshCapital] = useCapitalStream();

  const contextValue = useMemo(
    () => ({
      ...capital,
      refreshCapital,
    }),
    [capital.balance, capital.equity, capital.used_margin, capital.free_margin, refreshCapital]
  );

  const handleSymbolSelect = useCallback((newSymbol) => {
    setSymbol(newSymbol);
  }, []);

  return (
    <CapitalContext.Provider value={contextValue}>
      <div className="flex min-h-screen overflow-x-hidden">
        <Sidebar activePair={symbol} onSelect={handleSymbolSelect} />
        <main className="flex-1 overflow-x-hidden">
          <Outlet context={{ symbol, setSymbol: handleSymbolSelect }} />
        </main>
      </div>
    </CapitalContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kyc" element={<KycPublic />} />
        <Route path="/login" element={<Login />} />

        {/* Protected app under /app/* */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderTable />} />
          <Route path="positions" element={<PositionsTable />} />
          <Route path="order-history" element={<OrderHistoryTable />} />
          <Route path="profile" element={<Profile />} />
          <Route path="deposit" element={<DepositPanel />} />
          <Route path="withdraw" element={<WithdrawlPanel />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
