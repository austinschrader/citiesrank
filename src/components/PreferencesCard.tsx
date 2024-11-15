import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, Compass, Train } from "lucide-react";
import { UserPreferences } from "../types";
import { PreferenceSlider } from "@/components/PreferenceSlider";

interface PreferencesCardProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export const PreferencesCard = ({ preferences, onPreferencesChange }: PreferencesCardProps) => {
  const getCostLabel = (value: number) => (value < 33 ? "Budget" : value < 66 ? "Moderate" : "Luxury");
  const getInterestLabel = (value: number) => (value < 33 ? "Basic" : value < 66 ? "Interesting" : "Fascinating");
  const getTransitLabel = (value: number) => (value < 33 ? "Basic" : value < 66 ? "Good" : "Excellent");

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Find your European hidden gem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <PreferenceSlider
            icon={Euro}
            label="Cost"
            value={preferences.cost}
            onChange={(cost) => onPreferencesChange({ ...preferences, cost })}
            labels={["Budget", "Moderate", "Luxury"]}
            getCurrentLabel={getCostLabel}
          />
          <PreferenceSlider
            icon={Compass}
            label="Things to Do"
            value={preferences.interesting}
            onChange={(interesting) => onPreferencesChange({ ...preferences, interesting })}
            labels={["Basic", "Interesting", "Fascinating"]}
            getCurrentLabel={getInterestLabel}
          />
          <PreferenceSlider
            icon={Train}
            label="Public Transit"
            value={preferences.transit}
            onChange={(transit) => onPreferencesChange({ ...preferences, transit })}
            labels={["Basic", "Good", "Excellent"]}
            getCurrentLabel={getTransitLabel}
          />
        </div>
      </CardContent>
    </Card>
  );
};
