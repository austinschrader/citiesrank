import { Users, PenLine, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ListHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  autoSaveStatus: string;
  onPreview: () => void;
  onDone: () => void;
  isSubmitting?: boolean;
}

export function ListHeader({ title, onTitleChange, autoSaveStatus, onPreview, onDone, isSubmitting = false }: ListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1 max-w-2xl">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Give your list a name..."
          className="text-2xl font-semibold border-none px-0 focus-visible:ring-0"
        />
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Public
          </div>
          <div className="flex items-center gap-1">
            <PenLine className="h-4 w-4" />
            {autoSaveStatus}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onPreview}>
          Preview
        </Button>
        <Button size="sm" className="gap-2" onClick={onDone} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Done <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
