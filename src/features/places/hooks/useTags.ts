// file location: src/features/places/hooks/useTags.ts
import { getApiUrl } from "@/config/appConfig";
import { TagsResponse } from "@/lib/types/pocketbase-types";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

export interface FilterOption {
  id: string;
  label: string;
  identifier: string;
}

export const useTags = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const pb = new PocketBase(getApiUrl());
        const tags = await pb.collection("tags").getFullList<TagsResponse>({
          sort: "order",
          filter: "active = true",
        });

        const options: FilterOption[] = tags.map((tag) => ({
          id: tag.id,
          label: tag.label,
          identifier: tag.identifier,
        }));

        setFilterOptions(options);
        setError(null);
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch tags")
        );
        setFilterOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { filterOptions, isLoading, error };
};
