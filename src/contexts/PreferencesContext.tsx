import { createContext, useContext, ReactNode } from "react";
import { useMatchScores, MatchScoreContextValue } from "@/hooks/useMatchScores";

const PreferencesContext = createContext<MatchScoreContextValue | null>(null);

interface PreferencesProviderProps {
  children: ReactNode;
  initialPreferences?: Parameters<typeof useMatchScores>[0];
}

export const PreferencesProvider = ({
  children,
  initialPreferences,
}: PreferencesProviderProps) => {
  const matchScores = useMatchScores(initialPreferences);

  return (
    <PreferencesContext.Provider value={matchScores}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): MatchScoreContextValue => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
