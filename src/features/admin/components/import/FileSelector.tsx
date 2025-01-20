import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface FileData {
  content: unknown;
  lastModified?: string;
  size?: number;
}

interface FileSelectorProps {
  files: Record<string, FileData>;
  selectedFiles: string[];
  onFileSelect: (values: string[]) => void;
  onError?: (error: Error) => void;
}

export function FileSelector({
  files,
  selectedFiles,
  onFileSelect,
  onError,
}: FileSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleFile = (file: string) => {
    try {
      const newSelection = selectedFiles.includes(file)
        ? selectedFiles.filter((f) => f !== file)
        : [...selectedFiles, file];
      onFileSelect(newSelection);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Failed to toggle file selection"));
    }
  };

  const handleSelectAll = () => {
    try {
      const allFiles = Object.keys(files);
      onFileSelect(selectedFiles.length === allFiles.length ? [] : allFiles);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Failed to select all files"));
    }
  };

  const fileOptions = Object.entries(files).map(([file, data]) => ({
    value: file,
    label: file.split("/").pop()?.replace(".json", "") || file,
    size: data.size ? `${(data.size / 1024).toFixed(1)} KB` : undefined,
    lastModified: data.lastModified,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Select Data Files</h2>
        <Button
          variant="outline"
          onClick={handleSelectAll}
          aria-label={selectedFiles.length === Object.keys(files).length ? "Deselect all files" : "Select all files"}
        >
          {selectedFiles.length === Object.keys(files).length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Choose data files"
            className="w-full justify-between"
          >
            {selectedFiles.length === 0 ? (
              <span className="text-muted-foreground">
                Choose data files to import...
              </span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {selectedFiles.map((file) => (
                  <Badge 
                    key={file} 
                    variant="secondary" 
                    className="mr-1"
                    tabIndex={0}
                    role="status"
                  >
                    {file.split("/").pop()?.replace(".json", "")}
                  </Badge>
                ))}
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-[300px] overflow-y-auto">
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
                  onSelect={() => toggleFile(file.value)}
                  className="flex justify-between items-center"
                  role="option"
                  aria-selected={selectedFiles.includes(file.value)}
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedFiles.includes(file.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span>{file.label}</span>
                  </div>
                  {(file.size || file.lastModified) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {file.size && <span>{file.size}</span>}
                      {file.lastModified && (
                        <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
