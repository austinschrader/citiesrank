import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Find your next adventure...",
  className,
}: SearchInputProps) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full pl-8 h-8 bg-white shadow-sm border hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/50 rounded-lg transition-all duration-200 text-sm placeholder:text-indigo-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
    </div>
  );
};
