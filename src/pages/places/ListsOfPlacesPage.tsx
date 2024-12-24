import { ListsOfPlaces } from "@/features/places/components/ListsOfPlaces";

export const ListsOfPlacesPage = () => {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background to-background/95">
      <ListsOfPlaces />
    </div>
  );
};
