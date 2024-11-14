import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Users } from "lucide-react";
import { UserPreferences } from "../types";
import { PreferenceSlider } from "@/components/PreferenceSlider";

interface PreferencesCardProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export const PreferencesCard = ({ preferences, onPreferencesChange }: PreferencesCardProps) => {
  const getWeatherLabel = (value: number) => (value < 33 ? "Cold" : value < 66 ? "Moderate" : "Hot");

  const getDensityLabel = (value: number) => (value < 33 ? "Rural" : value < 66 ? "Suburban" : "Urban");

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Find your next destination</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <PreferenceSlider
            icon={Cloud}
            label="Preferred Weather"
            value={preferences.weather}
            onChange={(weather) => onPreferencesChange({ ...preferences, weather })}
            labels={["Cold", "Moderate", "Hot"]}
            getCurrentLabel={getWeatherLabel}
          />
          <PreferenceSlider
            icon={Users}
            label="Preferred Population Density"
            value={preferences.density}
            onChange={(density) => onPreferencesChange({ ...preferences, density })}
            labels={["Rural", "Suburban", "Urban"]}
            getCurrentLabel={getDensityLabel}
          />
        </div>
      </CardContent>
    </Card>
  );
};
