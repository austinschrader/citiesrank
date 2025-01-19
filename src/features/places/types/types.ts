import type { CitiesResponse } from "@/lib/types/pocketbase-types";

export type PlaceCardProps = {
  city: CitiesResponse;
  onClick?: () => void;
  variant?: "ranked" | "basic" | "compact";
};
