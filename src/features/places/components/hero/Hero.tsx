/**
 * Location: src/features/places/components/Hero/Hero.tsx
 * Purpose: Main hero component with search functionality for places
 * Used by: HomePage.tsx
 * Dependencies: useSearchForm.ts for search logic, SignUpDialog for auth
 */

import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { getImageUrl } from "@/lib/cloudinary";
import { useSearchForm } from "../../search/hooks/useSearchForm";
import { PLACE_TYPES } from "./constants";
import { SearchInput } from "./SearchInput";
import { SearchTabs } from "./SearchTabs";

export const Hero = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isSearchFocused,
    setIsSearchFocused,
    showSignUpDialog,
    setShowSignUpDialog,
    handleSearch,
  } = useSearchForm();

  const activeTabData = PLACE_TYPES.find((type) => type.id === activeTab)!;

  return (
    <div className="relative">
      {/* Hero Content */}
      <div className="relative h-[60vh] sm:h-[50vh]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={getImageUrl("bordeaux-france-1", "wide")}
            alt="Beautiful travel destination"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-xl leading-tight">
              {activeTabData.header}
            </h1>

            {/* Search Section */}
            <div className="mt-4">
              {/* Tabs and Search Container */}
              <div className="flex flex-col w-full sm:max-w-xl">
                <SearchTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isSearchFocused={isSearchFocused}
                />
                <SearchInput
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setIsSearchFocused={setIsSearchFocused}
                  handleSearch={handleSearch}
                  currentType={activeTab}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Dialog */}
      <SignUpDialog
        open={showSignUpDialog}
        onOpenChange={setShowSignUpDialog}
      />
    </div>
  );
};
