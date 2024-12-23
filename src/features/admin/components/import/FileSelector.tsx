import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileSelectorProps {
  files: Record<string, any>;
  selectedFile: string | null;
  onFileSelect: (value: string) => void;
}

export function FileSelector({ files, selectedFile, onFileSelect }: FileSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Data File</h2>
      <Select onValueChange={onFileSelect} value={selectedFile || undefined}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a data file to import" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(files).map((file) => (
            <SelectItem key={file} value={file}>
              {file.split("/").pop()?.replace(".json", "")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
