import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ImportButtonProps {
  isImporting: boolean;
  onImport: () => void;
  disabled?: boolean;
}

export function ImportButton({
  isImporting,
  onImport,
  disabled,
}: ImportButtonProps) {
  return (
    <Button
      onClick={onImport}
      disabled={isImporting || disabled}
      className="w-full md:w-auto"
    >
      {isImporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Importing...
        </>
      ) : (
        "Import Places"
      )}
    </Button>
  );
}
