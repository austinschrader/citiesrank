// file location: src/features/preferences/context/PreferencesContext.tsx
import { useMatchScores } from "@/features/preferences/hooks/useMatchScores";
import { MatchScoreContextValue } from "@/features/preferences/types";
import { createContext, ReactNode } from "react";

export const PreferencesContext = createContext<MatchScoreContextValue | null>(
  null
);

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
