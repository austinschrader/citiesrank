// file location: src/features/preferences/hooks/usePreferences.ts
import { PreferencesContext } from "@/features/preferences/context/PreferencesContext";
import { MatchScoreContextValue } from "@/features/preferences/types";
import { useContext } from "react";

export const usePreferences = (): MatchScoreContextValue => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
