// src/features/places/components/ui/cards/SaveButton.tsx
/**
 * Button to save places to collections
 */
import { Button } from "@/components/ui/button";
import { useSavedPlaces } from "@/features/lists/context/SavedPlacesContext";
import { SaveCollectionsDialog } from "@/features/map/components/SaveCollectionsDialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useState } from "react";

interface SaveButtonProps {
  placeId: string;
  onAuthRequired: () => void;
}

export const SaveButton = ({ placeId, onAuthRequired }: SaveButtonProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { isPlaceSaved, refreshSavedPlaces } = useSavedPlaces();
  const { toast } = useToast();
  const isSaved = isPlaceSaved(placeId);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveDialog(true);
  };

  return (
    <>
      <Button
        size="icon"
        variant="secondary"
        className={cn(
          "absolute top-3 right-3 z-30 h-8 w-8 rounded-full backdrop-blur-md transition-all duration-300 group",
          isSaved
            ? "bg-primary/20 hover:bg-primary/30 dark:bg-primary/30 dark:hover:bg-primary/40"
            : "bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30"
        )}
        onClick={handleSaveClick}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-all duration-300 ease-spring",
            isSaved 
              ? "text-primary fill-primary scale-110" 
              : "text-white/90 group-hover:scale-110"
          )}
        />
        <span className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap opacity-0 scale-95 transition-all duration-200",
          "bg-black/80 text-white backdrop-blur-md",
          "group-hover:opacity-100 group-hover:scale-100"
        )}>
          {isSaved ? "Saved" : "Save"}
        </span>
      </Button>

      <SaveCollectionsDialog
        isOpen={showSaveDialog}
        onClose={() => {
          setShowSaveDialog(false);
          refreshSavedPlaces();
        }}
        placeId={placeId}
      />
    </>
  );
};
