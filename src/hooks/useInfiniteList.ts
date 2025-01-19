import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteListProps<T> {
  items: T[];
  initialItemsToShow?: number;
  itemsPerPage?: number;
  loadingDelay?: number;
}

interface UseInfiniteListReturn<T> {
  displayItems: T[];
  isLoadingMore: boolean;
  observerRef: React.RefObject<HTMLDivElement>;
  hasMore: boolean;
}

export function useInfiniteList<T>({
  items,
  initialItemsToShow = 12,
  itemsPerPage = 12,
  loadingDelay = 500,
}: UseInfiniteListProps<T>): UseInfiniteListReturn<T> {
  const [numToShow, setNumToShow] = useState(initialItemsToShow);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Get paginated items
  const displayItems = items.slice(0, numToShow);

  // Check if there are more items to load
  const hasMore = numToShow < items.length;

  // Load more items
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setNumToShow(prev => prev + itemsPerPage);
      setIsLoadingMore(false);
    }, loadingDelay);
  }, [hasMore, isLoadingMore, itemsPerPage, loadingDelay]);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  return {
    displayItems,
    isLoadingMore,
    observerRef,
    hasMore,
  };
}
