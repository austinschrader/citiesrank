import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Euro, Users, Navigation2, Landmark, Store } from "lucide-react";
import { UserPreferences } from "../types";

interface PreferencesCardProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export const PreferencesCard = ({ preferences, onPreferencesChange }: PreferencesCardProps) => {
  const handleSliderChange = (key: keyof Omit<UserPreferences, "specialFeatures">) => (value: number[]) => {
    onPreferencesChange({
      ...preferences,
      [key]: value[0],
    });
  };

  const handleSwitchChange = (key: keyof UserPreferences["specialFeatures"]) => (checked: boolean) => {
    onPreferencesChange({
      ...preferences,
      specialFeatures: {
        ...preferences.specialFeatures,
        [key]: checked,
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Find Your Hidden Gem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          {/* Main Priority Sliders */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-primary" />
                <span className="font-medium">Value for Money Priority</span>
              </div>
              <Slider
                value={[preferences.valueImportance]}
                onValueChange={handleSliderChange("valueImportance")}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Local Authenticity Priority</span>
              </div>
              <Slider
                value={[preferences.authenticityImportance]}
                onValueChange={handleSliderChange("authenticityImportance")}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Navigation2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Practicality Priority</span>
              </div>
              <Slider
                value={[preferences.practicalityImportance]}
                onValueChange={handleSliderChange("practicalityImportance")}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" />
                <span className="font-medium">Cultural Scene Priority</span>
              </div>
              <Slider
                value={[preferences.culturalImportance]}
                onValueChange={handleSliderChange("culturalImportance")}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Special Features Toggles */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Special Interests
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">Foodie Focus</label>
                <Switch checked={preferences.specialFeatures.foodFocus} onCheckedChange={handleSwitchChange("foodFocus")} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Cafe Culture</label>
                <Switch checked={preferences.specialFeatures.cafeCulture} onCheckedChange={handleSwitchChange("cafeCulture")} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Evening/Nightlife</label>
                <Switch checked={preferences.specialFeatures.nightlife} onCheckedChange={handleSwitchChange("nightlife")} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Regional Base</label>
                <Switch checked={preferences.specialFeatures.baseLocation} onCheckedChange={handleSwitchChange("baseLocation")} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
