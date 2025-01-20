/**
 * Handles content type switching between places and lists panels.
 * Driven by HeaderContext's contentType.
 */
import { PlacesPanel } from "./PlacesPanel";
import { ListsPanel } from "./ListsPanel";
import { useHeader } from "@/context/HeaderContext";

export const ContentPanel = () => {
  const { contentType } = useHeader();
  return contentType === "places" ? <PlacesPanel /> : <ListsPanel />;
};
