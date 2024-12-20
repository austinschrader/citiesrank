import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const pageSizeOptions = [15, 25, 50, 100, 500] as const;

interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const PageSizeSelect = ({ value, onChange }: PageSizeSelectProps) => {
  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => {
        const newSize = parseInt(value);
        onChange(newSize);
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Places per page" />
      </SelectTrigger>
      <SelectContent>
        {pageSizeOptions.map((size) => (
          <SelectItem key={size} value={size.toString()}>
            {size} places
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
