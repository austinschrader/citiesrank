import { getApiUrl } from "@/config/appConfig";
import {
  Collections,
  ListsCollectionOptions,
  ListsPrivacyOptions,
  ListsResponse,
  ListsStatusOptions,
} from "@/lib/types/pocketbase-types";
import debounce from "lodash/debounce";
import PocketBase, { RecordModel } from "pocketbase";
import { useEffect, useRef, useState } from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

export const useLists = () => {
  const [lists, setLists] = useState<ListsResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentRequestIdRef = useRef<string>("");
  const isLoadingRef = useRef(false);
  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  useEffect(() => {
    const loadLists = async () => {
      if (isLoadingRef.current) return;

      const requestId = Math.random().toString(36).substring(7);
      currentRequestIdRef.current = requestId;
      isLoadingRef.current = true;

      try {
        const records = await pb.collection("lists").getFullList({
          sort: "-created",
          ...(searchQuery && {
            filter: `title ~ "${searchQuery}" || description ~ "${searchQuery}"`,
          }),
          expand: "author",
          $autoCancel: false,
        });

        if (currentRequestIdRef.current === requestId) {
          const transformedLists = records.map(
            (record: RecordModel): ListsResponse => ({
              id: record.id,
              collectionId: record.collectionId,
              collectionName: Collections.Lists,
              created: record.created,
              updated: record.updated,
              title: record.title,
              description: record.description,
              author: record.author,
              places: record.places || [],
              tags:
                typeof record.tags === "string"
                  ? JSON.parse(record.tags)
                  : record.tags || [],
              likes: record.likes || 0,
              shares: record.shares || 0,
              saves: record.saves || 0,
              views: record.views || 0,
              status: record.status || ListsStatusOptions.published,
              collection:
                record.collection || ListsCollectionOptions["want-to-visit"],
              privacy: record.privacy || ListsPrivacyOptions.public,
              category: record.category || "",
              isVerified: record.isVerified || false,
              relatedLists: record.relatedLists || [],
              totalPlaces: record.totalPlaces || 0,
            })
          );
          setLists(transformedLists);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error loading lists:", error);
        }
      } finally {
        if (currentRequestIdRef.current === requestId) {
          isLoadingRef.current = false;
          setIsLoading(false);
        }
      }
    };

    loadLists();
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSearch(value);
  };

  const getSortedLists = (
    sortType: "popular" | "recent" | "trending"
  ): ListsResponse[] => {
    switch (sortType) {
      case "popular":
        return [...lists].sort((a, b) => b.likes - a.likes);
      case "recent":
        return [...lists].sort(
          (a, b) =>
            new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
      case "trending":
        return [...lists].sort((a, b) => b.shares - a.shares);
      default:
        return lists;
    }
  };

  const getFilteredUserLists = (userId: string) => {
    return lists.filter((list) => list.author === userId);
  };

  return {
    lists,
    isLoading,
    searchInputValue,
    handleSearchChange,
    getSortedLists,
    getFilteredUserLists,
  };
};
