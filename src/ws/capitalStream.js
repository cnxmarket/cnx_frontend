// src/ws/capitalStream.js
import { API_BASE } from "../api/config";

export async function fetchCapital() {
  const token = localStorage.getItem("access") || "";
  if (!token) {
    console.warn("No access token found for capital API");
    throw new Error("Not authenticated");
  }

  // Assumes your API endpoint is at /api/capital/
  const res = await fetch(`${API_BASE}/api/capital/`, {
    headers: {
      "Content-Type": "application/json",
      // If you use JWT/Bearer tokens, pass token in header:
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // Needed if your auth requires cookies
  });

  if (!res.ok) {
    throw new Error("Failed to fetch capital: " + res.status);
  }
  return await res.json();
}
