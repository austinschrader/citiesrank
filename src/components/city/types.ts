import { CityData } from "@/types";

export interface CityInsight {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    isLocal: boolean;
  };
  category: "local-tip" | "question" | "update" | "discussion";
  votes: number;
  responseCount: number;
  createdAt: string;
  tags: string[];
}

export interface LocationState {
  cityData?: CityData;
}

export interface NeighborhoodData {
  name: string;
  description: string;
  safety: number;
  costLevel: number;
  transitAccess: number;
}
