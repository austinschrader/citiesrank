import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHeader } from "@/features/header/context/HeaderContext";

const pageSizeOptions = [15, 25, 50, 100, 500] as const;

export const PageSizeSelect = () => {
  const { itemsPerPage, setItemsPerPage } = useHeader();

  return (
    <Select
      value={itemsPerPage.toString()}
      onValueChange={(val) => setItemsPerPage(Number(val))}
    >
      <SelectTrigger className="text-sm font-medium text-indigo-600">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {pageSizeOptions.map((size) => (
          <SelectItem
            key={size}
            value={size.toString()}
            className="text-sm font-medium"
          >
            {size} per page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
