// file location: src/features/auth/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
