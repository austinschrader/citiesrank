/**
 * Location: src/features/places/search/hooks/useSearchForm.ts
 * Purpose: Manages search form state and navigation logic
 * Used by: Hero.tsx and other search components
 * Dependencies: FiltersContext, AuthContext
 */

import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  CitiesResponse,
  CitiesTypeOptions,
} from "@/lib/types/pocketbase-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSlug } from "../../utils/placeUtils";

export const useSearchForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CitiesTypeOptions>(
    CitiesTypeOptions.country
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  const handleSearch = (e: React.FormEvent, selectedCity?: CitiesResponse) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    if (!user) {
      setShowSignUpDialog(true);
      return;
    }

    const searchData = selectedCity || {
      name: searchQuery,
      type: activeTab,
    };

    navigate(
      `/places/${activeTab}/${createSlug(selectedCity?.name || searchQuery)}`,
      {
        state: {
          placeData: searchData,
        },
      }
    );
  };

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isSearchFocused,
    setIsSearchFocused,
    showSignUpDialog,
    setShowSignUpDialog,
    handleSearch,
  };
};
