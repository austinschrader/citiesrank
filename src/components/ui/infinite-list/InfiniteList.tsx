import React from "react";
import { useInfiniteList } from "@/hooks/useInfiniteList";

interface InfiniteListProps<T> {
  items: T[];
  renderItems: (items: T[]) => React.ReactNode;
  initialItemsToShow?: number;
  itemsPerPage?: number;
  loadingDelay?: number;
  className?: string;
  loadingSpinnerClassName?: string;
}

export function InfiniteList<T>({
  items,
  renderItems,
  initialItemsToShow,
  itemsPerPage,
  loadingDelay,
  className,
  loadingSpinnerClassName = "animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full",
}: InfiniteListProps<T>) {
  const { displayItems, isLoadingMore, observerRef, hasMore } = useInfiniteList({
    items,
    initialItemsToShow,
    itemsPerPage,
    loadingDelay,
  });

  return (
    <>
      {renderItems(displayItems)}

      {/* Loading indicator and observer */}
      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {isLoadingMore && hasMore && <div className={loadingSpinnerClassName} />}
      </div>
    </>
  );
}
