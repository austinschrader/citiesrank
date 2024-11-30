import { Slider } from "@/components/ui/slider";
import { LucideIcon } from "lucide-react";

export interface PreferenceSliderProps {
  icon: LucideIcon;
  label: string;
  value: number;
  onChange: (value: number) => void;
  labels: string[];
  getCurrentLabel: (value: number) => string;
  hint: string;
}

export const PreferenceSlider = ({ icon: Icon, label, value, onChange, labels, getCurrentLabel }: PreferenceSliderProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{getCurrentLabel(value)}</span>
    </div>
    <Slider value={[value]} onValueChange={(values) => onChange(values[0])} max={100} step={1} className="w-full" />
    <div className="flex justify-between text-xs text-muted-foreground">
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  </div>
);
