import { ReactNode } from "react";

interface SearchLayoutProps {
  searchBar: ReactNode;
  filters: ReactNode;
}

export function SearchLayout({ searchBar, filters }: SearchLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-4 h-full">
      <div className="w-full">{searchBar}</div>
      <div className="flex-1 overflow-hidden">{filters}</div>
    </div>
  );
}
