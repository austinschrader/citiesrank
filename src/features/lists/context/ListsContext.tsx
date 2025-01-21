import { useAuth } from "@/features/auth/hooks/useAuth";
import { ExpandedList, ListWithPlaces } from "@/features/lists/types";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { ClientResponseError } from "pocketbase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ListsContextType {
  lists: ExpandedList[];
  sortedLists: ExpandedList[];
  isLoading: boolean;
  error: ClientResponseError | null;
  sortBy: string;
  setSortBy: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  createList: ({
    title,
    description,
    places,
    visibility,
  }: {
    title: string;
    description?: string;
    places: string[];
    visibility?: "public" | "private";
  }) => Promise<ExpandedList>;
  getList: (id: string) => Promise<ListWithPlaces>;
  getUserLists: () => Promise<ExpandedList[]>;
  updateList: (
    id: string,
    {
      title,
      description,
      places,
      visibility,
    }: {
      title?: string;
      description?: string;
      places?: string[];
      visibility?: "public" | "private";
    }
  ) => Promise<ExpandedList>;
  deleteList: (id: string) => Promise<void>;
  addPlaceToList: (listId: string, place: CitiesResponse) => Promise<void>;
  removePlaceFromList: (listId: string, place: CitiesResponse) => Promise<void>;
}

const ListsContext = createContext<ListsContextType | null>(null);

export function ListsProvider({ children }: { children: ReactNode }) {
  const { pb, user } = useAuth();
  const [lists, setLists] = useState<ExpandedList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ClientResponseError | null>(null);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Compute sorted and filtered lists
  const sortedLists = useMemo(() => {
    let filteredLists = [...lists];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredLists = filteredLists.filter(
        (list) =>
          list.title.toLowerCase().includes(query) ||
          list.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    return filteredLists.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return (b.places?.length || 0) - (a.places?.length || 0);
        case "recent":
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [lists, sortBy, searchQuery]);

  const createList = useCallback(
    async ({
      title,
      description,
      places,
      visibility = "private",
    }: {
      title: string;
      description?: string;
      places: string[];
      visibility?: "public" | "private";
    }) => {
      try {
        setIsLoading(true);
        setError(null);

        // Create the list first
        const list = (await pb.collection("lists").create(
          {
            title,
            description,
            user: user?.id,
            place_count: places.length,
            visibility,
          },
          {
            expand: "users",
            $autoCancel: false,
          }
        )) as ExpandedList;

        // Update local state immediately for better UX
        setLists((prev) => [...prev, list]);

        // Add places to the list and wait for them to complete
        await Promise.all(
          places.map((place, index) =>
            pb.collection("list_places").create(
              {
                list: list.id,
                place: place,
                rank: index + 1,
              },
              {
                $autoCancel: false,
              }
            )
          )
        );

        // Now that list_places are created, we can update the list location
        await updateListLocation(list.id);

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

        // First, try just getting the list without any expansion
        const basicList = await pb
          .collection("lists")
          .getOne<ExpandedList>(id, {
            $autoCancel: false,
          });

        // Now try with just user expansion
        const listWithUser = await pb
          .collection("lists")
          .getOne<ExpandedList>(id, {
            $autoCancel: false,
            expand: "user",
          });

        // Get the list_places records separately first
        const listPlaces = await pb.collection("list_places").getFullList({
          filter: `list = "${id}"`,
          sort: "rank",
          $autoCancel: false,
        });

        // Now try getting list_places with expanded place data
        const listPlacesExpanded = await pb
          .collection("list_places")
          .getFullList({
            filter: `list = "${id}"`,
            sort: "rank",
            expand: "place",
            $autoCancel: false,
          });
        // Finally try the full expansion
        const list = await pb.collection("lists").getOne<ExpandedList>(id, {
          $autoCancel: false,
          expand: "user,places_via_list",
        });

        // Get the actual place records from the expanded data
        const places = listPlacesExpanded
          .map((lp) => lp.expand?.place)
          .filter((p): p is CitiesResponse => !!p);

        const listWithPlaces: ListWithPlaces = {
          ...list,
          places,
          stats: {
            places: list.place_count || 0,
            saves: list.saves || 0,
          },
          curator: {
            name: list.expand?.user?.name || "Anonymous",
            avatar: list.expand?.user?.avatar || "",
          },
        };

        return listWithPlaces;
      } catch (err) {
        const error = err as ClientResponseError;
        console.error("Error in getList:", error);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [pb]
  );

  const getUserLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For signed-out users, only show public lists
      // For signed-in users, show their lists and public lists
      const filter = user
        ? `(user = "${user.id}" || visibility = "public")`
        : 'visibility = "public"';

      try {
        // First try a simple query to check if we can access the collection at all
        const testQuery = await pb.collection("lists").getList(1, 1, {
          $autoCancel: false,
        });

        // Now try our filtered query
        const lists = (await pb.collection("lists").getFullList({
          filter,
          expand: "user",
          sort: "-created",
          $autoCancel: false,
        })) as ExpandedList[];

        if (lists.length === 0) {
          // Check if there are any lists at all
          const allLists = await pb.collection("lists").getFullList({
            $autoCancel: false,
          });
        }

        const allListPlaces = await Promise.all(
          lists.map(async (list) => {
            try {
              const places = await pb.collection("list_places").getFullList({
                filter: `list = "${list.id}"`,
                expand: "place",
                sort: "rank",
                $autoCancel: false,
              });
              return places;
            } catch (err) {
              console.error(`Error fetching places for list ${list.id}:`, err);
              return [];
            }
          })
        );

        // Combine all list places
        const placesByList = allListPlaces.reduce((acc, listPlaces, index) => {
          const listId = lists[index].id;
          acc[listId] = listPlaces
            .map((lp) => lp.expand?.place)
            .filter((p): p is CitiesResponse => !!p);
          return acc;
        }, {} as Record<string, CitiesResponse[]>);

        // Transform the expanded places into the format we need
        const listsWithPlaces = lists.map((list) => ({
          ...list,
          places: placesByList[list.id] || [],
        }));

        setLists(listsWithPlaces);
        return listsWithPlaces;
      } catch (err) {
        const error = err as ClientResponseError;
        console.error("Error fetching lists:", error);
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } catch (err) {
      const error = err as ClientResponseError;
      console.error("Error fetching lists:", error);
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
        visibility,
      }: {
        title?: string;
        description?: string;
        places?: string[];
        visibility?: "public" | "private";
      }
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        // Update list metadata
        const data: any = {};
        if (title) data.title = title;
        if (description) data.description = description;
        if (visibility) data.visibility = visibility;

        const list = (await pb.collection("lists").update(id, data, {
          expand: "users",
        })) as ExpandedList;

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
        const list = (await pb.collection("lists").getOne(listId, {
          $autoCancel: false,
        })) as ExpandedList;

        await pb.collection("lists").update(
          listId,
          {
            place_count: (list.place_count || 1) - 1,
          },
          {
            $autoCancel: false,
          }
        );

        // Update lists in state
        setLists((prev) =>
          prev.map((l) =>
            l.id === listId
              ? { ...l, place_count: (l.place_count || 1) - 1 }
              : l
          )
        );

        // Reorder remaining places
        const remainingPlaces = await pb.collection("list_places").getFullList({
          filter: `list = "${listId}"`,
          sort: "rank",
          $autoCancel: false,
        });

        await Promise.all(
          remainingPlaces.map((place, index) =>
            pb.collection("list_places").update(
              place.id,
              { rank: index + 1 },
              {
                $autoCancel: false,
              }
            )
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

  const updateListLocation = useCallback(
    async (listId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the list places
        const listPlaces = await pb.collection("list_places").getFullList({
          filter: `list = "${listId}"`,
          expand: "place",
          sort: "rank",
          $autoCancel: false,
        });

        // Get the actual place records from the expanded data
        const places = listPlaces
          .map((lp) => lp.expand?.place)
          .filter((p): p is CitiesResponse => !!p);

        if (places.length === 0) {
          console.warn(`No places found for list ${listId}`);
          return;
        }

        // Calculate center
        const lats = places.map((p) => p.latitude);
        const lngs = places.map((p) => p.longitude);
        const center_lat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const center_lng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

        // Update list location
        await pb.collection("list_locations").create(
          {
            list: listId,
            center_lat,
            center_lng,
          },
          {
            $autoCancel: false,
          }
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

  const value = {
    lists,
    sortedLists,
    isLoading,
    error,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    createList,
    getList,
    getUserLists,
    updateList,
    deleteList,
    addPlaceToList,
    removePlaceFromList,
  };

  return (
    <ListsContext.Provider value={value}>{children}</ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error("useLists must be used within a ListsProvider");
  }
  return context;
}
