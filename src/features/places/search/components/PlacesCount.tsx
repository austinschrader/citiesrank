import { CitiesResponse } from "@/lib/types/pocketbase-types";

interface PlacesCountProps {
  places: CitiesResponse[];
  selectedTypes?: Set<string>;
}

export function PlacesCount({ places, selectedTypes }: PlacesCountProps) {
  const typeBreakdown = places.reduce((acc, place) => {
    acc[place.type] = (acc[place.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = places.length;
  const isFiltered = selectedTypes && selectedTypes.size > 0;
  
  const formatType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isFiltered && selectedTypes!.size === 1) {
    // If only one type is selected, show specific count
    const type = Array.from(selectedTypes!)[0];
    return (
      <div className="text-sm text-muted-foreground">
        {typeBreakdown[type] || 0} {formatType(type)}
        {typeBreakdown[type] !== 1 ? "s" : ""} found
      </div>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      <span>{totalCount} place{totalCount !== 1 ? "s" : ""} found</span>
      {!isFiltered && Object.keys(typeBreakdown).length > 1 && (
        <div className="mt-1 text-xs">
          {Object.entries(typeBreakdown).map(([type, count]) => (
            <span key={type} className="mr-3">
              {count} {formatType(type)}{count !== 1 ? "s" : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
