// file location: src/features/auth/hooks/useAuth.ts
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
