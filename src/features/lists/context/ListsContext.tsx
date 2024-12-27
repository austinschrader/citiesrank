import { useAuth } from "@/features/auth/hooks/useAuth";
import { CitiesResponse, ListsResponse, UsersResponse } from "@/lib/types/pocketbase-types";
import { ClientResponseError } from "pocketbase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type ListWithPlaces = ListsResponse & {
  places: CitiesResponse[];
  stats: {
    places: number;
    saves: number;
  };
  curator: {
    name: string;
    avatar: string;
  };
  expand: {
    user: UsersResponse;
  };
};

interface ListsContextType {
  lists: ListsResponse[];
  isLoading: boolean;
  error: ClientResponseError | null;
  createList: ({
    title,
    description,
    places,
  }: {
    title: string;
    description?: string;
    places: string[];
  }) => Promise<ListsResponse>;
  getList: (id: string) => Promise<ListWithPlaces>;
  getUserLists: () => Promise<ListsResponse[]>;
  updateList: (
    id: string,
    {
      title,
      description,
      places,
    }: {
      title?: string;
      description?: string;
      places?: string[];
    }
  ) => Promise<ListsResponse>;
  deleteList: (id: string) => Promise<void>;
  addPlaceToList: (listId: string, place: CitiesResponse) => Promise<void>;
  removePlaceFromList: (listId: string, place: CitiesResponse) => Promise<void>;
}

const ListsContext = createContext<ListsContextType | null>(null);

export function ListsProvider({ children }: { children: ReactNode }) {
  const { pb, user } = useAuth();
  const [lists, setLists] = useState<ListsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ClientResponseError | null>(null);

  const createList = useCallback(
    async ({
      title,
      description,
      places,
    }: {
      title: string;
      description?: string;
      places: string[];
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        // Create the list first
        const list = await pb.collection("lists").create({
          title,
          description,
          user: user?.id,
          place_count: places.length,
        }) as ListsResponse;

        // Update local state immediately for better UX
        setLists((prev) => [...prev, list]);

        // Add places to the list in the background
        Promise.all(
          places.map((place, index) =>
            pb.collection("list_places").create({
              list: list.id,
              place: place,
              rank: index + 1,
            })
          )
        ).catch((err) => {
          console.error('Failed to add all places to list:', err);
        });

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

        // Get the list with $autoCancel false to prevent cancellation
        const list = await pb.collection("lists").getOne<ListsResponse & { expand: { user: UsersResponse } }>(id, {
          $autoCancel: false,
          expand: 'user',
        });

        // Get the places in the list
        const listPlaces = await pb
          .collection("list_places")
          .getFullList({ 
            filter: `list = "${id}"`,
            sort: "rank",
            $autoCancel: false,
          });

        // Get the actual place records
        const places = await pb.collection("cities").getFullList({
          filter: listPlaces.map(lp => `id = "${lp.place}"`).join(" || "),
          $autoCancel: false,
        }) as CitiesResponse[];

        // Sort places according to rank
        const sortedPlaces = listPlaces
          .map((lp) => places.find((p) => p.id === lp.place))
          .filter((p): p is CitiesResponse => !!p);

        const listWithPlaces: ListWithPlaces = {
          ...list,
          places: sortedPlaces,
          stats: {
            places: list.place_count || 0,
            saves: list.saves || 0,
          },
          curator: {
            name: list.expand?.user?.name || 'Anonymous',
            avatar: list.expand?.user?.avatar || '',
          },
          expand: {
            user: list.expand.user
          }
        };

        return listWithPlaces;
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
    if (!user) {
      setLists([]);
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const records = await pb
        .collection("lists")
        .getFullList({
          filter: `user = "${user.id}"`,
          $autoCancel: false,
        }) as ListsResponse[];

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
      }: {
        title?: string;
        description?: string;
        places?: string[];
      }
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
                place: place,
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
    async (listId: string, place: CitiesResponse) => {
      try {
        setIsLoading(true);
        setError(null);

        // Find the list_places record
        const record = await pb
          .collection("list_places")
          .getFirstListItem(`list = "${listId}" && place = "${place.id}"`, {
            $autoCancel: false,
          });

        // Delete the record
        await pb.collection("list_places").delete(record.id, {
          $autoCancel: false,
        });

        // Update place_count on the list
        const list = await pb.collection("lists").getOne(listId, {
          $autoCancel: false,
        }) as ListsResponse;
        
        await pb.collection("lists").update(listId, {
          place_count: (list.place_count || 1) - 1,
        }, {
          $autoCancel: false,
        });

        // Update lists in state
        setLists((prev) =>
          prev.map((l) =>
            l.id === listId
              ? { ...l, place_count: (l.place_count || 1) - 1 }
              : l
          )
        );

        // Reorder remaining places
        const remainingPlaces = await pb
          .collection("list_places")
          .getFullList({
            filter: `list = "${listId}"`,
            sort: "rank",
            $autoCancel: false,
          });

        await Promise.all(
          remainingPlaces.map((place, index) =>
            pb.collection("list_places").update(place.id, { rank: index + 1 }, {
              $autoCancel: false,
            })
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
