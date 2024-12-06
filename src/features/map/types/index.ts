// src/features/map/types/index.ts
import { MatchScore } from "@/features/preferences/types";
import { CitiesResponse } from "@/lib/types/pocketbase-types";

export type MapPlace = CitiesResponse & Partial<MatchScore>;

export interface MapViewState {
  zoom: number;
  center: [number, number];
  geographicLevel: "country" | "region" | "city" | "neighborhood" | "sight";
}
