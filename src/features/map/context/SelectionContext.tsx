import { MapPlace } from "../types";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface SelectionContextType {
  selectedPlace: MapPlace | null;
  setSelectedPlace: (place: MapPlace | null, isFromMap?: boolean) => void;
  fromMap: boolean;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [fromMap, setFromMap] = useState(false);

  const setSelectedPlaceWithSource = useCallback((place: MapPlace | null, isFromMap = false) => {
    setSelectedPlace(place);
    setFromMap(isFromMap);
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedPlace, setSelectedPlace: setSelectedPlaceWithSource, fromMap }}>
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
