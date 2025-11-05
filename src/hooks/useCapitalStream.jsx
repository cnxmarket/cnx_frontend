// src/hooks/useCapitalStream.jsx
import { useEffect, useState, useCallback } from "react";
import { fetchCapital } from "../ws/capitalStream"; // Make sure capitalStream.js has fetchCapital (as provided above)

export function useCapitalStream() {
  const [capital, setCapital] = useState({
    balance: 0,
    equity: 0,
    used_margin: 0,
    free_margin: 0,
  });

  // The callback to re-fetch and update capital
  const refreshCapital = useCallback(() => {
    fetchCapital()
      .then((data) => setCapital(data))
      .catch((e) => {
        console.error("Error loading capital:", e);
        setCapital({
          balance: 0,
          equity: 0,
          used_margin: 0,
          free_margin: 0,
        });
      });
  }, []);

  // Initial load and refresh on mount
  useEffect(() => {
    refreshCapital();
  }, [refreshCapital]);

  return [capital, refreshCapital];
}
