// import { useMemo } from "react";
// import { CityData, RankedCity, UserPreferences } from "../types";

// export const useCityRanking = (cityData: Record<string, CityData>, preferences: UserPreferences) => {
//   return useMemo(() => {
//     return Object.entries(cityData)
//       .map(([name, data]): RankedCity => {
//         const weatherMatch = 100 - Math.abs(data.weather - preferences.weather);
//         const densityMatch = 100 - Math.abs(data.populationDensity - preferences.density);
//         const matchScore = (weatherMatch + densityMatch) / 2;

//         return {
//           name,
//           ...data,
//           matchScore,
//           attributeMatches: {
//             weather: weatherMatch,
//             density: densityMatch,
//           },
//         };
//       })
//       .sort((a, b) => b.matchScore - a.matchScore);
//   }, [preferences, cityData]);
// };
