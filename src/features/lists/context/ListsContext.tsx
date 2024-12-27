import { useAuth } from "@/features/auth/hooks/useAuth";
import { CitiesResponse, ListsResponse } from "@/lib/types/pocketbase-types";
import { ClientResponseError } from "pocketbase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface ListsContextType {
  lists: ListsResponse[];
  isLoading: boolean;
  error: Error | null;
  createList: (data: {
    title: string;
    description?: string;
    places: CitiesResponse[];
  }) => Promise<ListsResponse>;
  getList: (
    id: string
  ) => Promise<ListsResponse & { places: CitiesResponse[] }>;
  getUserLists: () => Promise<ListsResponse[]>;
  updateList: (
    id: string,
    data: Partial<{
      title: string;
      description: string;
      places: CitiesResponse[];
    }>
  ) => Promise<ListsResponse>;
  deleteList: (id: string) => Promise<void>;
  addPlaceToList: (listId: string, place: CitiesResponse) => Promise<void>;
  removePlaceFromList: (listId: string, placeId: string) => Promise<void>;
}

const ListsContext = createContext<ListsContextType | null>(null);

export function ListsProvider({ children }: { children: ReactNode }) {
  const { pb, user } = useAuth();
  const [lists, setLists] = useState<ListsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createList = useCallback(
    async ({
      title,
      description,
      places,
    }: {
      title: string;
      description?: string;
      places: CitiesResponse[];
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        // Create the list
        const list = await pb.collection("lists").create({
          title,
          description,
          user: user?.id,
        }) as ListsResponse;

        // Add places to the list
        const placePromises = places.map((place, index) =>
          pb.collection("list_places").create({
            list: list.id,
            place: place.id,
            rank: index + 1,
          })
        );
        await Promise.all(placePromises);

        // Update local state
        setLists((prev) => [...prev, list]);

        return list;
      } catch (err) {
        const error = err as ClientResponseError;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [pb, user]
  );

  const getList = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the list
        const list = await pb.collection("lists").getOne(id) as ListsResponse;

        // Get the places in the list
        const listPlaces = await pb
          .collection("list_places")
          .getFullList({ filter: `list = "${id}"`, sort: "rank" });

        // Get the actual place records
        const placeIds = listPlaces.map((lp) => lp.place);
        const places = await pb
          .collection("cities")
          .getFullList({ filter: `id in ["${placeIds.join('","')}"]` }) as CitiesResponse[];

        // Sort places according to rank
        const sortedPlaces = listPlaces
          .map((lp) => places.find((p) => p.id === lp.place))
          .filter((p): p is CitiesResponse => !!p);

        return { ...list, places: sortedPlaces };
      } catch (err) {
        const error = err as ClientResponseError;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [pb]
  );

  const getUserLists = useCallback(async () => {
    if (!user) return [];

    try {
      setIsLoading(true);
      setError(null);

      const records = await pb
        .collection("lists")
        .getFullList({ filter: `user = "${user.id}"` }) as ListsResponse[];

      setLists(records);
      return records;
    } catch (err) {
      const error = err as ClientResponseError;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [pb, user]);

  const updateList = useCallback(
    async (
      id: string,
      {
        title,
        description,
        places,
      }: Partial<{
        title: string;
        description: string;
        places: CitiesResponse[];
      }>
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        // Update list metadata
        const data: Record<string, any> = {};
        if (title) data.title = title;
        if (description) data.description = description;

        const list = await pb.collection("lists").update(id, data) as ListsResponse;

        // If places are provided, update them
        if (places) {
          // Delete existing places
          await pb
            .collection("list_places")
            .getFullList({ filter: `list = "${id}"` })
            .then((records) =>
              Promise.all(
                records.map((record) =>
                  pb.collection("list_places").delete(record.id)
                )
              )
            );

          // Add new places
          await Promise.all(
            places.map((place, index) =>
              pb.collection("list_places").create({
                list: id,
                place: place.id,
                rank: index + 1,
              })
            )
          );
        }

        // Update local state
        setLists((prev) =>
          prev.map((l) => (l.id === id ? { ...l, ...data } : l))
        );

        return list;
      } catch (err) {
        const error = err as ClientResponseError;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [pb]
  );

  const deleteList = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Delete all list places first
        await pb
          .collection("list_places")
          .getFullList({ filter: `list = "${id}"` })
          .then((records) =>
            Promise.all(
              records.map((record) =>
                pb.collection("list_places").delete(record.id)
              )
            )
          );

        // Delete the list
        await pb.collection("lists").delete(id);

        // Update local state
        setLists((prev) => prev.filter((l) => l.id !== id));
      } catch (err) {
        const error = err as ClientResponseError;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [pb]
  );

  const addPlaceToList = useCallback(
    async (listId: string, place: CitiesResponse) => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current places to determine rank
        const currentPlaces = await pb
          .collection("list_places")
          .getFullList({ filter: `list = "${listId}"` });

        // Add the new place
        await pb.collection("list_places").create({
          list: listId,
          place: place.id,
          rank: currentPlaces.length + 1,
        });
      } catch (err) {
        const error = err as ClientResponseError;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [pb]
  );

  const removePlaceFromList = useCallback(
    async (listId: string, placeId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Find and delete the list place record
        const record = await pb
          .collection("list_places")
          .getFirstListItem(`list = "${listId}" && place = "${placeId}"`);

        await pb.collection("list_places").delete(record.id);

        // Reorder remaining places
        const remainingPlaces = await pb.collection("list_places").getFullList({
          filter: `list = "${listId}"`,
          sort: "rank",
        });

        await Promise.all(
          remainingPlaces.map((place, index) =>
            pb.collection("list_places").update(place.id, { rank: index + 1 })
          )
        );
      } catch (err) {
        const error = err as ClientResponseError;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [pb]
  );

  return (
    <ListsContext.Provider
      value={{
        lists,
        isLoading,
        error,
        createList,
        getList,
        getUserLists,
        updateList,
        deleteList,
        addPlaceToList,
        removePlaceFromList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useLists must be used within a ListsProvider");
  }
  return context;
}
