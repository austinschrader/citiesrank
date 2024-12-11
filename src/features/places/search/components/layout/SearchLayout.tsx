import { ReactNode } from "react";

interface SearchLayoutProps {
  searchBar: ReactNode;
  filters: ReactNode;
}

export function SearchLayout({ searchBar, filters }: SearchLayoutProps) {
  return (
    <div className="flex flex-col h-full divide-y divide-border">
      <div className="px-6 py-4">
        {searchBar}
      </div>
      
      <div className="flex-1 pt-4">
        {filters}
      </div>
    </div>
  );
}
