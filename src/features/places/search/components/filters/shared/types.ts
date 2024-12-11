export interface FilterItem {
  label: string;
  emoji: string;
  count?: number;
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  color: string;
  filters: FilterItem[];
}

export interface FilterSectionProps {
  title: string;
  filters: FilterItem[];
  emoji: string;
  color: string;
  selectedFilters: Set<string>;
  onFilterToggle: (filter: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}
