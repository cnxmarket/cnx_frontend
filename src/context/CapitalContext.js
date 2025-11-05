// src/context/CapitalContext.js
import { createContext, useContext } from "react";
export const CapitalContext = createContext(null);
export function useCapitalContext() {
  return useContext(CapitalContext);
}
