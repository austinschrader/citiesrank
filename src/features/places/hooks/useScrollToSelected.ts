import { CitiesResponse } from "@/lib/types/pocketbase-types";
import { RefObject, useEffect, useRef } from "react";

export const useScrollToSelected = (
  selectedItem: CitiesResponse | null,
  fromMap: boolean
): RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedItem && ref.current && fromMap) {
      const selectedElement = ref.current.querySelector(
        `[data-id="${selectedItem.id}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedItem, fromMap]);

  return ref;
};
