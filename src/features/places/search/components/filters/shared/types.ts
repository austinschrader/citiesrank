export interface FilterItem {
  label: string;
  displayLabel?: string;
  emoji?: string;
  count?: number;
  selected?: boolean;
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  color: string;
  filters: FilterItem[];
  singleSelect?: boolean;
  displayLabel?: string;
}

export interface FilterSectionProps {
  title: string;
  filters: FilterItem[];
  emoji: string;
  color: string;
  selectedFilters?: Set<string>;
  onFilterToggle: (filter: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  singleSelect?: boolean;
}
