import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlaceUpload } from "./PlaceUpload";
import { ReactNode } from "react";

interface AddPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function AddPlaceDialog({ open, onOpenChange, children }: AddPlaceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] overflow-y-auto">
        <div className="py-4">
          <PlaceUpload onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
