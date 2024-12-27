import { CitiesResponse, ListPlacesResponse, ListsResponse } from "@/lib/types/pocketbase-types";

// Define a type for expanded list places
export type ExpandedListPlace = ListPlacesResponse & {
  expand?: {
    place?: CitiesResponse;
  };
};

// Define a type for lists with expanded user and places
export type ExpandedList = ListsResponse & {
  expand?: {
    user?: {
      name: string;
      avatar: string;
    };
    list_places?: Array<{
      place: string;
      list: string;
      expand?: {
        place?: CitiesResponse;
      };
    }>;
  };
  places?: CitiesResponse[];
};

// Define a type for lists with places and stats
export type ListWithPlaces = ExpandedList & {
  places: CitiesResponse[];
  stats: {
    places: number;
    saves: number;
  };
  curator: {
    name: string;
    avatar: string;
  };
};
