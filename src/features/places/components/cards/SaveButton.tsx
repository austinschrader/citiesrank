// src/features/places/components/cards/SaveButton.tsx
/**
 * Button to save places to collections
 */
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { SaveCollectionsDialog } from "@/features/map/components/SaveCollectionsDialog";

interface SaveButtonProps {
  placeId: string;
  onAuthRequired: () => void;
}

export const SaveButton = ({
  placeId,
  onAuthRequired,
}: SaveButtonProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { toast } = useToast();

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveDialog(true);
  };

  return (
    <>
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-3 right-3 z-30 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        onClick={handleSaveClick}
      >
        <FolderPlus className="h-4 w-4 text-white/80" />
      </Button>

      <SaveCollectionsDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        placeId={placeId}
      />
    </>
  );
};
