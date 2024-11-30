import { getApiUrl } from "@/config/appConfig";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import PocketBase from "pocketbase";

const apiUrl = getApiUrl();
const pb = new PocketBase(apiUrl);

export const usePopularCities = async (): Promise<CitiesResponse[]> => {
  try {
    const popularCitiesData = await pb.collection("favorites").getList(1, 6, {
      expand: "city",
      sort: "-created",
    });

    return popularCitiesData.items
      .map((item) => item.expand?.city)
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching popular cities:", error);
    return [];
  }
};
