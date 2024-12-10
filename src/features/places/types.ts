import type { MatchScore } from "@/features/preferences/types";
import type { CitiesResponse } from "@/lib/types/pocketbase-types";

export interface BasePlaceCardProps {
  variant: "ranked" | "basic" | "compact";
}

export interface RankedPlaceCardProps extends BasePlaceCardProps {
  variant: "ranked";
  city: CitiesResponse;
  matchScore: MatchScore;
}

export interface BasicPlaceCardProps extends BasePlaceCardProps {
  variant: "basic";
  city: CitiesResponse;
}

export interface CompactPlaceCardProps extends BasePlaceCardProps {
  variant: "compact";
  city: CitiesResponse;
}

export type PlaceCardProps =
  | RankedPlaceCardProps
  | BasicPlaceCardProps
  | CompactPlaceCardProps;
