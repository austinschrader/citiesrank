import React from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlaceUpload } from './PlaceUpload';

export function AddPlaceButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-0 bg-primary"
          size="icon"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Place</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[90vh] overflow-y-auto">
        <div className="py-4">
          <PlaceUpload />
        </div>
      </DialogContent>
    </Dialog>
  );
}
