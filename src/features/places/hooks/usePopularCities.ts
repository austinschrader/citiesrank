import { getApiUrl } from "@/config/appConfig";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import PocketBase from "pocketbase";
import { useCallback } from "react";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

export const usePopularCities = () => {
  return useCallback(async () => {
    try {
      const popularCitiesData = await pb.collection("favorites").getList(1, 6, {
        expand: "city",
        sort: "-created",
      });

      return popularCitiesData.items
        .map((item) => item.expand?.city)
        .filter(Boolean) as CitiesResponse[];
    } catch (error) {
      console.error("Error fetching popular cities:", error);
      return [];
    }
  }, []);
};
