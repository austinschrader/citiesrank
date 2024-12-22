import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddPlaceDialog } from './AddPlaceDialog';

export function AddPlaceButton() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <AddPlaceDialog open={open} onOpenChange={setOpen}>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-0 bg-primary"
        size="icon"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add Place</span>
      </Button>
    </AddPlaceDialog>
  );
}
