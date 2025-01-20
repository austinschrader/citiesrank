import { useAuth } from "@/features/auth/hooks/useAuth";
import { pb } from "@/lib/pocketbase";
import { useCallback, createContext, useContext, useEffect, useState } from "react";
import { useLists } from "./ListsContext";
import { useSavedLists } from "./SavedListsContext";

interface SavedPlacesContextValue {
  isPlaceSaved: (placeId: string) => boolean;
  isLoading: boolean;
  error: Error | null;
  refreshSavedPlaces: () => Promise<void>;
}

const SavedPlacesContext = createContext<SavedPlacesContextValue | null>(null);

export const SavedPlacesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const { lists } = useLists();
  const { savedLists } = useSavedLists();
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load all saved places
  const loadSavedPlaces = useCallback(async () => {
    if (!user) {
      setSavedPlaceIds(new Set());
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get all list_places for user's own lists and saved lists
      const allListIds = [
        ...lists.map((list) => list.id),
        ...savedLists.map((list) => list.id),
      ];

      if (allListIds.length === 0) {
        setSavedPlaceIds(new Set());
        return;
      }

      const listPlaces = await pb.collection("list_places").getFullList({
        filter: allListIds.map((id) => `list = "${id}"`).join(" || "),
        $autoCancel: false,
      });

      // Extract unique place IDs
      const placeIds = new Set(listPlaces.map((lp) => lp.place));
      setSavedPlaceIds(placeIds);
    } catch (err) {
      console.error("Failed to load saved places:", err);
      setError(err instanceof Error ? err : new Error("Failed to load saved places"));
    } finally {
      setIsLoading(false);
    }
  }, [user, lists, savedLists]);

  // Reload saved places when lists or saved lists change
  useEffect(() => {
    loadSavedPlaces();
  }, [loadSavedPlaces]);

  const isPlaceSaved = useCallback(
    (placeId: string) => savedPlaceIds.has(placeId),
    [savedPlaceIds]
  );

  return (
    <SavedPlacesContext.Provider
      value={{
        isPlaceSaved,
        isLoading,
        error,
        refreshSavedPlaces: loadSavedPlaces,
      }}
    >
      {children}
    </SavedPlacesContext.Provider>
  );
};

export const useSavedPlaces = () => {
  const context = useContext(SavedPlacesContext);
  if (!context) {
    throw new Error("useSavedPlaces must be used within a SavedPlacesProvider");
  }
  return context;
};
