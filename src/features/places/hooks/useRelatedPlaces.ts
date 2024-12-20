import { useAuth } from "@/features/auth/hooks/useAuth";
import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { useEffect, useState } from "react";

export const useRelatedPlaces = (place: CitiesResponse) => {
  const [relatedPlaces, setRelatedPlaces] = useState<CitiesResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pb } = useAuth();

  useEffect(() => {
    const fetchRelatedPlaces = async () => {
      setIsLoading(true);
      try {
        let filter = "";

        // For cities, show other cities in the same country
        if (place.type === "city") {
          filter = `country = "${place.country}" && id != "${place.id}" && type = "city"`;
        }
        // For countries, show popular cities in that country
        else if (place.type === "country") {
          filter = `country = "${place.name}" && type = "city"`;
        }
        // For regions, show cities in that region
        else if (place.type === "region") {
          filter = `region = "${place.name}" && type = "city"`;
        }
        // For neighborhoods, show other neighborhoods in the same city
        else if (place.type === "neighborhood") {
          // Use parentId to find related neighborhoods
          filter = `parentId = "${place.parentId}" && type = "neighborhood" && id != "${place.id}"`;
        }
        // For sights, show other sights in the same city/neighborhood
        else if (place.type === "sight") {
          // Use parentId to find related sights
          filter = `parentId = "${place.parentId}" && type = "sight" && id != "${place.id}"`;
        }

        console.log("Fetching related places with filter:", filter);
        console.log("Current place:", place);

        const records = await pb.collection("cities").getList(1, 4, {
          filter,
          sort: "-rating",
        });

        console.log("Found related places:", records.items);
        setRelatedPlaces(records.items as CitiesResponse[]);
      } catch (error) {
        console.error("Error fetching related places:", error);
        setRelatedPlaces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedPlaces();
  }, [place.id, place.type, place.country, place.name, place.parentId, pb]);

  return { relatedPlaces, isLoading };
};
