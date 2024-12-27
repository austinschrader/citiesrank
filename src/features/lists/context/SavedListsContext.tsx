import { useAuth } from "@/features/auth/hooks/useAuth";
import { ListsResponse } from "@/lib/types/pocketbase-types";
import { client } from "@/lib/pocketbase/client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ClientResponseError } from "pocketbase";

interface SavedListsContextValue {
  savedLists: ListsResponse[];
  isLoading: boolean;
  error: Error | null;
  saveList: (listId: string) => Promise<void>;
  unsaveList: (listId: string) => Promise<void>;
  isSaved: (listId: string) => boolean;
}

const SavedListsContext = createContext<SavedListsContextValue | null>(null);

export const SavedListsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [savedLists, setSavedLists] = useState<ListsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadSavedLists = useCallback(async () => {
    if (!user) {
      setSavedLists([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const records = await client.collection("saved_lists").getFullList({
        filter: `user = "${user.id}"`,
        expand: "list",
        $autoCancel: false,
      });

      // Extract the expanded list records
      const lists = records.map((record) => record.expand?.list as ListsResponse).filter(Boolean);
      setSavedLists(lists);
    } catch (err) {
      console.error("Failed to load saved lists:", err);
      setError(err instanceof Error ? err : new Error("Failed to load saved lists"));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveList = useCallback(async (listId: string) => {
    if (!user) {
      throw new Error("Must be logged in to save lists");
    }

    try {
      setError(null);
      await client.collection("saved_lists").create({
        user: user.id,
        list: listId,
      });

      // Get the list details
      const list = await client.collection("lists").getOne<ListsResponse>(listId);
      setSavedLists((prev) => [...prev, list]);

      // Update the saves count on the list
      await client.collection("lists").update(listId, {
        saves: (list.saves || 0) + 1,
      });
    } catch (err) {
      console.error("Failed to save list:", err);
      setError(err instanceof ClientResponseError ? err : new Error("Failed to save list"));
      throw err;
    }
  }, [user]);

  const unsaveList = useCallback(async (listId: string) => {
    if (!user) {
      throw new Error("Must be logged in to unsave lists");
    }

    try {
      setError(null);

      // Find the saved_lists record
      const record = await client
        .collection("saved_lists")
        .getFirstListItem(`user = "${user.id}" && list = "${listId}"`);

      // Delete the record
      await client.collection("saved_lists").delete(record.id);

      // Update local state
      setSavedLists((prev) => prev.filter((list) => list.id !== listId));

      // Update the saves count on the list
      const list = await client.collection("lists").getOne<ListsResponse>(listId);
      await client.collection("lists").update(listId, {
        saves: Math.max(0, (list.saves || 1) - 1),
      });
    } catch (err) {
      console.error("Failed to unsave list:", err);
      setError(err instanceof ClientResponseError ? err : new Error("Failed to unsave list"));
      throw err;
    }
  }, [user]);

  const isSaved = useCallback((listId: string) => {
    return savedLists.some((list) => list.id === listId);
  }, [savedLists]);

  useEffect(() => {
    loadSavedLists();
  }, [loadSavedLists]);

  return (
    <SavedListsContext.Provider
      value={{
        savedLists,
        isLoading,
        error,
        saveList,
        unsaveList,
        isSaved,
      }}
    >
      {children}
    </SavedListsContext.Provider>
  );
};

export const useSavedLists = () => {
  const context = useContext(SavedListsContext);
  if (!context) {
    throw new Error("useSavedLists must be used within a SavedListsProvider");
  }
  return context;
};
