import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, Users, Clock, Thermometer, Train, Car } from "lucide-react";
import { UserPreferences } from "../types";
import { PreferenceSlider } from "@/components/PreferenceSlider";

interface PreferencesCardProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export const PreferencesCard = ({ preferences, onPreferencesChange }: PreferencesCardProps) => {
  const getBudgetLabel = (value: number) => (value < 33 ? "Budget-Friendly" : value < 66 ? "Mid-Range" : "Luxury");
  const getCrowdsLabel = (value: number) => (value < 33 ? "Off the Beaten Path" : value < 66 ? "Moderate Tourism" : "Popular");
  const getTripLengthLabel = (value: number) =>
    value < 33 ? "Quick Visit (1-2 days)" : value < 66 ? "Short Stay (3-4 days)" : "Extended Stay (5+ days)";
  const getSeasonLabel = (value: number) => (value < 33 ? "Winter" : value < 66 ? "Spring/Fall" : "Summer");
  const getTransitLabel = (value: number) => (value < 33 ? "Basic" : value < 66 ? "Good" : "Excellent");
  const getDistanceLabel = (value: number) => (value < 33 ? "Remote" : value < 66 ? "Semi-Remote" : "Well-Connected");

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Customize Your Perfect Trip</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <PreferenceSlider
            icon={Euro}
            label="Budget Level"
            value={preferences.budget}
            onChange={(budget) => onPreferencesChange({ ...preferences, budget })}
            labels={["Budget", "Mid-Range", "Luxury"]}
            getCurrentLabel={getBudgetLabel}
            hint="Daily cost for accommodation, food, and activities"
          />

          <PreferenceSlider
            icon={Users}
            label="Tourism Level"
            value={preferences.crowds}
            onChange={(crowds) => onPreferencesChange({ ...preferences, crowds })}
            labels={["Hidden Gems", "Moderate", "Popular"]}
            getCurrentLabel={getCrowdsLabel}
            hint="From undiscovered spots to popular destinations"
          />

          <PreferenceSlider
            icon={Clock}
            label="Ideal Stay Duration"
            value={preferences.tripLength}
            onChange={(tripLength) => onPreferencesChange({ ...preferences, tripLength })}
            labels={["1-2 Days", "3-4 Days", "5+ Days"]}
            getCurrentLabel={getTripLengthLabel}
            hint="Recommended time to fully experience the destination"
          />

          <PreferenceSlider
            icon={Thermometer}
            label="Best Season"
            value={preferences.season}
            onChange={(season) => onPreferencesChange({ ...preferences, season })}
            labels={["Winter", "Spring/Fall", "Summer"]}
            getCurrentLabel={getSeasonLabel}
            hint="When this destination is most enjoyable"
          />

          <PreferenceSlider
            icon={Train}
            label="Local Transit"
            value={preferences.transit}
            onChange={(transit) => onPreferencesChange({ ...preferences, transit })}
            labels={["Basic", "Good", "Excellent"]}
            getCurrentLabel={getTransitLabel}
            hint="Quality of public transportation within the destination"
          />

          <PreferenceSlider
            icon={Car}
            label="Location Access"
            value={preferences.accessibility}
            onChange={(accessibility) => onPreferencesChange({ ...preferences, accessibility })}
            labels={["Remote", "Semi-Remote", "Well-Connected"]}
            getCurrentLabel={getDistanceLabel}
            hint="How easy it is to reach from major airports/cities"
          />
        </div>
      </CardContent>
    </Card>
  );
};
