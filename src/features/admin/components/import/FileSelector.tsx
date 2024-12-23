import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface FileSelectorProps {
  files: Record<string, any>;
  selectedFiles: string[];
  onFileSelect: (values: string[]) => void;
}

export function FileSelector({ files, selectedFiles, onFileSelect }: FileSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleFile = (file: string) => {
    const newSelection = selectedFiles.includes(file)
      ? selectedFiles.filter((f) => f !== file)
      : [...selectedFiles, file];
    onFileSelect(newSelection);
  };

  const fileOptions = Object.keys(files).map((file) => ({
    value: file,
    label: file.split("/").pop()?.replace(".json", "") || file,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Data Files</h2>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedFiles.length === 0 ? (
              <span className="text-muted-foreground">Choose data files to import...</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedFiles.map((file) => (
                  <Badge
                    key={file}
                    variant="secondary"
                    className="mr-1"
                  >
                    {file.split("/").pop()?.replace(".json", "")}
                  </Badge>
                ))}
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search files..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandEmpty>No files found.</CommandEmpty>
            <CommandGroup>
              {fileOptions.map((file) => (
                <CommandItem
                  key={file.value}
                  value={file.value}
                  onSelect={() => {
                    toggleFile(file.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedFiles.includes(file.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {file.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
