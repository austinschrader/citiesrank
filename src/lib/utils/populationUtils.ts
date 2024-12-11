/**
 * Converts a population string (e.g., "2.2M", "10k", "100000") to a number
 */
export function normalizePopulation(population: string | number): number {
  if (typeof population === 'number') return population;

  const value = population.toLowerCase().trim();
  
  // Handle "M" (million) suffix
  if (value.endsWith('m')) {
    return parseFloat(value.slice(0, -1)) * 1_000_000;
  }
  
  // Handle "K" (thousand) suffix
  if (value.endsWith('k')) {
    return parseFloat(value.slice(0, -1)) * 1_000;
  }
  
  // Handle numeric strings
  return parseFloat(value.replace(/,/g, ''));
}

export const PopulationRanges = {
  SMALL: { min: 0, max: 100_000, label: 'Small (< 100k)' },
  MEDIUM: { min: 100_000, max: 1_000_000, label: 'Medium (100k - 1M)' },
  LARGE: { min: 1_000_000, max: 5_000_000, label: 'Large (1M - 5M)' },
  MEGA: { min: 5_000_000, max: Infinity, label: 'Mega (> 5M)' },
} as const;

export type PopulationRange = keyof typeof PopulationRanges;

export function getPopulationRange(population: string | number): PopulationRange | null {
  const normalizedPop = normalizePopulation(population);
  
  for (const [range, { min, max }] of Object.entries(PopulationRanges)) {
    if (normalizedPop >= min && normalizedPop < max) {
      return range as PopulationRange;
    }
  }
  
  return null;
}
