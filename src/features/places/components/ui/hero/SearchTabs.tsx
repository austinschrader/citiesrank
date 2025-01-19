/**
 * Location: src/features/places/components/Hero/SearchTabs.tsx
 * Purpose: Renders the search type tabs in the Hero component
 * Used by: Hero.tsx
 */

import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { PLACE_TYPES } from "./constants";

interface SearchTabsProps {
  activeTab: CitiesTypeOptions;
  setActiveTab: (tab: CitiesTypeOptions) => void;
  isSearchFocused: boolean;
  onTypeChange?: (type: CitiesTypeOptions) => void;
}

export const SearchTabs = ({
  activeTab,
  setActiveTab,
  isSearchFocused,
  onTypeChange,
}: SearchTabsProps) => {
  const handleTypeChange = (type: CitiesTypeOptions) => {
    setActiveTab(type);
    onTypeChange?.(type);
  };

  return (
    <div className="pl-0 sm:pl-2 mb-[-8px] relative z-10 overflow-x-auto overflow-y-hidden">
      <div className="flex gap-0.5 text-xs min-w-max">
        {PLACE_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeChange(type.id)}
            className={`
              px-2 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4 text-xs sm:text-sm font-medium
              transition-all duration-200
              relative rounded-tl-md rounded-tr-md border-2
              ${
                activeTab === type.id
                  ? `bg-white text-gray-900 ${
                      !isSearchFocused
                        ? "border-indigo-400/70"
                        : "border-transparent"
                    } translate-y-[1px]`
                  : "bg-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 hover:border-indigo-300/50 border-transparent hover:shadow-sm active:translate-y-[1px] active:border-indigo-400/70 active:bg-white active:text-gray-900"
              }
            `}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};
