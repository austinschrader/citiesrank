import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLists } from "@/features/lists/hooks/useLists";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { ListsTabs } from "@/features/lists/components/ListsTabs";
import { QuickCreateTemplates } from "@/features/lists/components/QuickCreateTemplates";

export const ListsPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const {
    lists,
    isLoading,
    searchInputValue,
    handleSearchChange,
    getSortedLists,
    getFilteredUserLists,
  } = useLists();

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-muted-foreground">Loading lists...</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-8 2xl:mx-16">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      <div className="px-4 md:mx-8 2xl:mx-16 py-4 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Lists</h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Discover curated collections of amazing places and create your own
              lists to share with the community.
            </p>
          </div>
          <Link to="/create-list" className="w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto">
              <Plus className="mr-2 h-5 w-5" /> Create List
            </Button>
          </Link>
        </div>

        <QuickCreateTemplates />

        <ListsTabs
          user={user}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchInputValue={searchInputValue}
          handleSearchChange={handleSearchChange}
          getSortedLists={getSortedLists}
          getFilteredUserLists={getFilteredUserLists}
        />
      </div>
    </div>
  );
};
