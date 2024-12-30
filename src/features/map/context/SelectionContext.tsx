import { MapPlace } from "../types";
import { createContext, useContext, useState, ReactNode } from "react";

interface SelectionContextType {
  selectedPlace: MapPlace | null;
  setSelectedPlace: (place: MapPlace | null) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);

  return (
    <SelectionContext.Provider value={{ selectedPlace, setSelectedPlace }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
