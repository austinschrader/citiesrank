import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CityCard } from "@/features/places/components/CityCard";
import { CitiesResponse } from "@/lib/types/pocketbase-types";

interface CitiesSectionProps {
  title: string;
  cities: CitiesResponse[];
}

export const CitiesSection = ({ title, cities }: CitiesSectionProps) => {
  if (!cities.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
      </div>
      <ScrollArea className="w-full whitespace-nowrap [&_.scrollbar]:bg-gray-100 [&_.scrollbar]:hover:bg-gray-200">
        <div className="flex w-full space-x-4 overflow-x-auto">
          {cities.map((city) => (
            <div key={city.id} className="w-[280px] shrink-0">
              <CityCard city={city} variant="basic" />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
