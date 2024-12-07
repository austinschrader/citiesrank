import { useState, useEffect } from 'react';

type GeographicLevel = "country" | "region" | "city" | "neighborhood" | "sight";

export function useGeographicLevel(viewMode: "list" | "map", mapZoom: number) {
  const [geographicLevel, setGeographicLevel] = useState<GeographicLevel>("country");

  useEffect(() => {
    if (viewMode === "map") {
      if (mapZoom <= 3) setGeographicLevel("country");
      else if (mapZoom <= 6) setGeographicLevel("region");
      else if (mapZoom <= 10) setGeographicLevel("city");
      else if (mapZoom <= 14) setGeographicLevel("neighborhood");
      else setGeographicLevel("sight");
    }
  }, [mapZoom, viewMode]);

  return {
    geographicLevel,
    setGeographicLevel
  };
}