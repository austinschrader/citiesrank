/**
 * Manages place navigation state and logic including:
 * - Sequential and random navigation between places
 * - Navigation history tracking
 * - Direction state management
 */
import { useState } from 'react';
import { MapPlace } from '../types';

interface NavigationState {
  direction: -1 | 0 | 1;
  isRandomMode: boolean;
}

export const usePlaceNavigation = (initialPlace: MapPlace, visiblePlaces: MapPlace[]) => {
  const [currentPlace, setCurrentPlace] = useState<MapPlace>(initialPlace);
  const [placeHistory, setPlaceHistory] = useState<MapPlace[]>([initialPlace]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [navigation, setNavigation] = useState<NavigationState>({
    direction: 0,
    isRandomMode: false,
  });

  const toggleRandomMode = () => {
    setNavigation((prev) => ({ ...prev, isRandomMode: !prev.isRandomMode }));
  };

  const navigateToPlace = (direction: "next" | "prev") => {
    const isNext = direction === "next";
    setNavigation((prev) => ({ ...prev, direction: isNext ? 1 : -1 }));

    const currentIndex = visiblePlaces.findIndex(
      (p) => p.id === currentPlace.id
    );

    let nextPlace: MapPlace;
    if (navigation.isRandomMode) {
      if (direction === "prev" && historyIndex > 0) {
        nextPlace = placeHistory[historyIndex - 1];
        setHistoryIndex((prev) => prev - 1);
      } else {
        const availablePlaces = visiblePlaces.filter(
          (_, i) => i !== currentIndex
        );
        const randomIndex = Math.floor(Math.random() * availablePlaces.length);
        nextPlace = availablePlaces[randomIndex];

        if (direction === "next") {
          setPlaceHistory((prev) => [...prev.slice(0, historyIndex + 1), nextPlace]);
          setHistoryIndex((prev) => prev + 1);
        }
      }
    } else {
      const nextIndex = isNext
        ? (currentIndex + 1) % visiblePlaces.length
        : currentIndex === 0
        ? visiblePlaces.length - 1
        : currentIndex - 1;
      nextPlace = visiblePlaces[nextIndex];
    }

    setCurrentPlace(nextPlace);
    return nextPlace;
  };

  return {
    currentPlace,
    navigation,
    toggleRandomMode,
    navigateToPlace
  };
};
