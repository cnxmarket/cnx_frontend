// src/hooks/useAdminTrades.js
import { useEffect, useState, useContext } from "react";
import { listMyAdminTrades } from "../api/adminTrades";
import { connectUserStream } from "../ws/userStream";
import { CapitalContext } from "../context/CapitalContext";

export function useAdminTrades() {
  const [rows, setRows] = useState([]);
  const { refreshCapital } = useContext(CapitalContext);

  useEffect(() => {
    listMyAdminTrades().then(setRows).catch(() => {});

    const ws = connectUserStream((msg) => {
      if (msg.event === "admin_trade_applied" && msg.data) {
        // prepend the applied trade to user-visible history
        setRows((prev) => [{ ...msg.data, status: "closed" }, ...prev]);
        // pull latest capital into UI
        if (refreshCapital) refreshCapital();
      }
    });
    return () => ws.close();
  }, [refreshCapital]);

  return rows;
}
