import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bike,
  Book,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Car,
  Clock,
  Cloud,
  Coffee,
  DollarSign,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  Laptop,
  Leaf,
  LucideIcon,
  Map,
  Moon,
  Mountain,
  Music,
  Plane,
  Rocket,
  Shield,
  Star,
  Sun,
  Train,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";
import React, { useState } from "react";

interface FilterItem {
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  filters: FilterItem[];
}

interface FilterSectionProps {
  title: string;
  filters: FilterItem[];
  icon: LucideIcon;
  color: string;
  selectedFilters: Set<string>;
  onFilterToggle: (filter: string) => void;
}

const categories: Category[] = [
  {
    id: "basics",
    title: "Basic Essentials",
    icon: Shield,
    color: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700",
    filters: [
      { label: "Drinkable Tap Water", icon: Shield },
      { label: "24/7 Convenience Stores", icon: Clock },
      { label: "Easy SIM Cards", icon: Wifi },
      { label: "ATMs Everywhere", icon: DollarSign },
      { label: "English at Hospitals", icon: Shield },
      { label: "Reliable Power", icon: Wifi },
      { label: "Clean Public Toilets", icon: Shield },
    ],
  },
  {
    id: "daily",
    title: "Daily Living",
    icon: Coffee,
    color: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700",
    filters: [
      { label: "Good Supermarkets", icon: Star },
      { label: "Hardware Stores", icon: Star },
      { label: "Easy Laundry", icon: Star },
      { label: "Food Delivery 24/7", icon: UtensilsCrossed },
      { label: "Late Night Shopping", icon: Star },
      { label: "Easy Package Delivery", icon: Star },
    ],
  },
  {
    id: "annoyances",
    title: "Common Annoyances",
    icon: Shield,
    color: "bg-gradient-to-r from-red-100 to-rose-100 text-red-700",
    filters: [
      { label: "No Street Harassment", icon: Shield },
      { label: "Low Traffic Noise", icon: Shield },
      { label: "Few Mosquitoes", icon: Shield },
      { label: "No Aggressive Vendors", icon: Shield },
      { label: "Clean Air", icon: Wind },
      { label: "Not Too Touristy", icon: Users },
    ],
  },
  {
    id: "specific",
    title: "Specific Needs",
    icon: Heart,
    color: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700",
    filters: [
      { label: "Wheelchair Friendly", icon: Heart },
      { label: "Vegan Options", icon: UtensilsCrossed },
      { label: "Halal Food", icon: UtensilsCrossed },
      { label: "Kosher Available", icon: UtensilsCrossed },
      { label: "Gluten-Free Friendly", icon: UtensilsCrossed },
      { label: "Child-Friendly Sidewalks", icon: Heart },
    ],
  },
  {
    id: "comfort",
    title: "Comfort & Convenience",
    icon: Star,
    color: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700",
    filters: [
      { label: "Not Too Humid", icon: Cloud },
      { label: "Good Air Conditioning", icon: Star },
      { label: "Good Heating", icon: Star },
      { label: "Quiet at Night", icon: Moon },
      { label: "No Power Cuts", icon: Star },
      { label: "Fast Deliveries", icon: Star },
    ],
  },
  {
    id: "community",
    title: "Community & Social",
    icon: Users,
    color: "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700",
    filters: [
      { label: "Active Facebook Groups", icon: Users },
      { label: "Meetup Events", icon: Users },
      { label: "Sports Groups", icon: Users },
      { label: "Language Exchange", icon: Globe },
      { label: "Parent Groups", icon: Users },
      { label: "Book Clubs", icon: Book },
    ],
  },
  {
    id: "pets",
    title: "Pet Friendly",
    icon: Heart,
    color: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700",
    filters: [
      { label: "Dog Parks", icon: Heart },
      { label: "Pet Cafes", icon: Coffee },
      { label: "Vet Clinics", icon: Shield },
      { label: "Pet Supplies", icon: Star },
      { label: "Pet Sitters", icon: Users },
      { label: "Dog-Friendly Transit", icon: Train },
    ],
  },
  {
    id: "work",
    title: "Remote Work",
    icon: Laptop,
    color: "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700",
    filters: [
      { label: "Cafes with Plugs", icon: Coffee },
      { label: "Libraries with Wifi", icon: Book },
      { label: "24/7 Workspaces", icon: Clock },
      { label: "Backup Internet", icon: Wifi },
      { label: "Phone Booths", icon: Star },
      { label: "Meeting Rooms", icon: Users },
    ],
  },
  {
    id: "medical",
    title: "Healthcare Access",
    icon: Shield,
    color: "bg-gradient-to-r from-cyan-100 to-sky-100 text-cyan-700",
    filters: [
      { label: "English Doctors", icon: Shield },
      { label: "24/7 Pharmacies", icon: Clock },
      { label: "Mental Health Care", icon: Heart },
      { label: "Dental Care", icon: Shield },
      { label: "Quality Hospitals", icon: Shield },
      { label: "Health Insurance", icon: Shield },
    ],
  },
  {
    id: "season",
    title: "Best Season to Visit",
    icon: Sun,
    color:
      "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200",
    filters: [
      { label: "Amazing in Spring", icon: Sun },
      { label: "Summer Paradise", icon: Sun },
      { label: "Fall Colors", icon: Moon },
      { label: "Winter Magic", icon: Cloud },
      { label: "Good Year-Round", icon: Clock },
      { label: "Peak Season Now", icon: Star },
      { label: "Off-Peak Deals", icon: DollarSign },
    ],
  },
  {
    id: "transport",
    title: "Getting Around",
    icon: Train,
    color:
      "bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 hover:from-sky-200 hover:to-blue-200",
    filters: [
      { label: "Metro System", icon: Train },
      { label: "Bike Lanes", icon: Bike },
      { label: "Walkable Streets", icon: Map },
      { label: "Night Transit", icon: Moon },
      { label: "Easy Airport Access", icon: Plane },
      { label: "Reliable Taxis", icon: Car },
      { label: "Good for Walking", icon: Map },
    ],
  },
  {
    id: "wellness",
    title: "Health & Wellness",
    icon: Heart,
    color:
      "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 hover:from-rose-200 hover:to-pink-200",
    filters: [
      { label: "Yoga Studios", icon: Heart },
      { label: "Fitness Culture", icon: Heart },
      { label: "Thermal Spas", icon: Waves },
      { label: "Clean Air Index", icon: Wind },
      { label: "Outdoor Gyms", icon: Mountain },
      { label: "Wellness Centers", icon: Heart },
      { label: "Mental Health", icon: Heart },
    ],
  },
  {
    id: "photography",
    title: "Photography & Views",
    icon: Camera,
    color:
      "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 hover:from-violet-200 hover:to-purple-200",
    filters: [
      { label: "Sunset Spots", icon: Sun },
      { label: "City Views", icon: Building2 },
      { label: "Nature Shots", icon: Mountain },
      { label: "Street Photography", icon: Camera },
      { label: "Historic Sites", icon: Landmark },
      { label: "Hidden Spots", icon: Map },
    ],
  },
  {
    id: "unique",
    title: "Unique Experiences",
    icon: Star,
    color:
      "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 hover:from-teal-200 hover:to-emerald-200",
    filters: [
      { label: "Local Festivals", icon: Music },
      { label: "Night Markets", icon: Moon },
      { label: "Traditional Crafts", icon: Heart },
      { label: "Local Secrets", icon: Star },
      { label: "Cultural Shows", icon: Music },
      { label: "Food Tours", icon: UtensilsCrossed },
    ],
  },
  {
    id: "architecture",
    title: "Architecture & Design",
    icon: Building2,
    color:
      "bg-gradient-to-r from-stone-100 to-zinc-100 text-stone-700 hover:from-stone-200 hover:to-zinc-200",
    filters: [
      { label: "Modern Design", icon: Building2 },
      { label: "Historic Buildings", icon: Building2 },
      { label: "Famous Landmarks", icon: Building2 },
      { label: "Urban Planning", icon: Map },
      { label: "Green Spaces", icon: Leaf },
      { label: "Public Art", icon: Camera },
    ],
  },
  {
    id: "language",
    title: "Language & Communication",
    icon: Globe,
    color:
      "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 hover:from-indigo-200 hover:to-blue-200",
    filters: [
      { label: "English Common", icon: Globe },
      { label: "Easy to Learn", icon: Book },
      { label: "Language Cafes", icon: Coffee },
      { label: "Cultural Exchange", icon: Users },
      { label: "Language Schools", icon: GraduationCap },
    ],
  },
  {
    id: "safety",
    title: "Safety & Security",
    icon: Shield,
    color:
      "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200",
    filters: [
      { label: "Safe at Night", icon: Moon },
      { label: "Women Friendly", icon: Heart },
      { label: "LGBTQ+ Safe", icon: Heart },
      { label: "Health Safety", icon: Shield },
      { label: "Low Crime Rate", icon: Shield },
      { label: "Political Stability", icon: Shield },
    ],
  },
  {
    id: "academic",
    title: "Academic & Research",
    icon: GraduationCap,
    color:
      "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 hover:from-red-200 hover:to-rose-200",
    filters: [
      { label: "Universities", icon: GraduationCap },
      { label: "Research Centers", icon: Laptop },
      { label: "Public Libraries", icon: Book },
      { label: "Study Spaces", icon: Book },
      { label: "Academic Events", icon: Calendar },
      { label: "Student Life", icon: Users },
    ],
  },
  {
    id: "business",
    title: "Business Environment",
    icon: Briefcase,
    color:
      "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 hover:from-blue-200 hover:to-sky-200",
    filters: [
      { label: "Startup Scene", icon: Rocket },
      { label: "Business Centers", icon: Building2 },
      { label: "Networking Events", icon: Users },
      { label: "Tax Benefits", icon: DollarSign },
      { label: "Investment Hub", icon: DollarSign },
    ],
  },
  {
    id: "medical-tourism",
    title: "Medical Tourism",
    icon: Shield,
    color: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700",
    filters: [
      { label: "Hair Transplant Centers", icon: Star },
      { label: "Dental Tourism", icon: Shield },
      { label: "Cosmetic Surgery", icon: Star },
      { label: "Recovery Hotels", icon: Building2 },
      { label: "Medical Visas Easy", icon: Shield },
      { label: "English-Speaking Doctors", icon: Globe },
      { label: "Medical Concierge", icon: Users },
      { label: "Wellness Centers", icon: Heart },
    ],
  },
  {
    id: "business",
    title: "Business Travel",
    icon: Briefcase,
    color: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700",
    filters: [
      { label: "Airport Lounges", icon: Plane },
      { label: "Business Hotels", icon: Building2 },
      { label: "Conference Centers", icon: Users },
      { label: "Fast Track Visa", icon: Clock },
      { label: "Business District", icon: Building2 },
      { label: "Express Transport", icon: Train },
      { label: "5G Coverage", icon: Wifi },
    ],
  },
  {
    id: "religious",
    title: "Religious & Cultural",
    icon: Star,
    color: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700",
    filters: [
      { label: "Halal Everywhere", icon: Star },
      { label: "Kosher Available", icon: Star },
      { label: "Prayer Rooms", icon: Heart },
      { label: "Religious Sites", icon: Building2 },
      { label: "Modest Dress Area", icon: Users },
      { label: "Cultural Respect", icon: Heart },
    ],
  },
  {
    id: "ethnic",
    title: "Ethnic Communities",
    icon: Globe,
    color: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700",
    filters: [
      { label: "Chinatown", icon: Building2 },
      { label: "Little India", icon: Star },
      { label: "Korean District", icon: Building2 },
      { label: "Arab Quarter", icon: Moon },
      { label: "Latino Community", icon: Music },
      { label: "African Diaspora", icon: Star },
    ],
  },
  {
    id: "language",
    title: "Language Access",
    icon: Globe,
    color: "bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700",
    filters: [
      { label: "English Common", icon: Globe },
      { label: "Chinese Spoken", icon: Globe },
      { label: "Spanish Common", icon: Globe },
      { label: "Arabic Signs", icon: Globe },
      { label: "Hindi/Urdu Used", icon: Globe },
      { label: "Language Schools", icon: Book },
    ],
  },
  {
    id: "senior",
    title: "Senior Travel",
    icon: Heart,
    color: "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700",
    filters: [
      { label: "Easy Terrain", icon: Mountain },
      { label: "Medical Facilities", icon: Shield },
      { label: "Senior Discounts", icon: DollarSign },
      { label: "Accessible Transit", icon: Train },
      { label: "Quiet Areas", icon: Moon },
      { label: "Senior Communities", icon: Users },
    ],
  },
  {
    id: "student",
    title: "Student Life",
    icon: GraduationCap,
    color: "bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700",
    filters: [
      { label: "Student Housing", icon: Building2 },
      { label: "Student Discounts", icon: DollarSign },
      { label: "Study Spots", icon: Book },
      { label: "Campus Life", icon: Users },
      { label: "Part-time Jobs", icon: Briefcase },
      { label: "Student Bars", icon: Music },
    ],
  },
  {
    id: "lgbtq",
    title: "LGBTQ+ Travel",
    icon: Heart,
    color: "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700",
    filters: [
      { label: "LGBTQ+ Venues", icon: Star },
      { label: "Pride Events", icon: Star },
      { label: "Safe Spaces", icon: Shield },
      { label: "Queer Culture", icon: Heart },
      { label: "LGBTQ+ Healthcare", icon: Shield },
      { label: "Community Centers", icon: Users },
    ],
  },
  {
    id: "digital-nomad",
    title: "Digital Nomads",
    icon: Laptop,
    color: "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700",
    filters: [
      { label: "Nomad Communities", icon: Users },
      { label: "Fast Internet", icon: Wifi },
      { label: "Coliving Spaces", icon: Building2 },
      { label: "Cafes to Work", icon: Coffee },
      { label: "Long-term Visas", icon: Shield },
      { label: "Tech Meetups", icon: Users },
    ],
  },
  {
    id: "family",
    title: "Family Travel",
    icon: Users,
    color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
    filters: [
      { label: "Kid-Friendly", icon: Heart },
      { label: "Family Activities", icon: Star },
      { label: "Safe Parks", icon: Mountain },
      { label: "Family Housing", icon: Building2 },
      { label: "Schools Nearby", icon: GraduationCap },
      { label: "Baby Facilities", icon: Heart },
    ],
  },
];

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  filters,
  icon: Icon,
  color,
  selectedFilters,
  onFilterToggle,
}) => {
  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`p-2 rounded-xl shadow-sm ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map(({ label, icon: FilterIcon }) => (
          <Button
            key={label}
            variant={selectedFilters.has(label) ? "default" : "outline"}
            className={`
              h-auto py-2 px-3.5 gap-2 rounded-xl
              font-medium text-sm
              transition-all duration-300
              hover:scale-105 hover:shadow-md
              ${
                selectedFilters.has(label)
                  ? color + " shadow-sm"
                  : "hover:bg-slate-50"
              }
            `}
            onClick={() => onFilterToggle(label)}
          >
            <FilterIcon className="h-4 w-4" />
            <span className="font-semibold">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

const navigationFilters = {
  id: "navigation",
  title: "Location & Scale",
  icon: Globe,
  color: "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700",
  filters: [
    { label: "Major Metropolis", icon: Building2 },
    { label: "Mid-Size City", icon: Building2 },
    { label: "Small City", icon: Building2 },
    { label: "Town or Village", icon: Building2 },
    { label: "Rural Area", icon: Mountain },
    { label: "Island", icon: Waves },
    { label: "Coastal", icon: Waves },
    { label: "Mountain", icon: Mountain },
    { label: "Desert", icon: Sun },
  ],
};

const costFilters = {
  id: "cost",
  title: "Cost & Budget",
  icon: DollarSign,
  color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
  filters: [
    { label: "Ultra Budget", icon: DollarSign },
    { label: "Budget Friendly", icon: DollarSign },
    { label: "Mid-Range", icon: DollarSign },
    { label: "High-End", icon: DollarSign },
    { label: "Ultra Luxury", icon: DollarSign },
    { label: "Good Value", icon: DollarSign },
    { label: "Cost Effective", icon: DollarSign },
    { label: "Tax Haven", icon: DollarSign },
  ],
};

const newCategories = [
  {
    id: "climate",
    title: "Climate & Weather",
    icon: Cloud,
    color: "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700",
    filters: [
      { label: "Year-round Spring", icon: Sun },
      { label: "No Extreme Weather", icon: Cloud },
      { label: "Low Humidity", icon: Wind },
      { label: "Mild Winters", icon: Cloud },
      { label: "Distinct Seasons", icon: Sun },
      { label: "Predictable Weather", icon: Sun },
      { label: "Disaster Safe", icon: Shield },
      { label: "Clear Skies", icon: Sun },
    ],
  },
  {
    id: "urban",
    title: "Urban Design",
    icon: Building2,
    color: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700",
    filters: [
      { label: "Grid Layout", icon: Map },
      { label: "Green Spaces", icon: Leaf },
      { label: "Car-Free Zones", icon: Car },
      { label: "Waterfront", icon: Waves },
      { label: "Historic Core", icon: Landmark },
      { label: "Modern Districts", icon: Building2 },
      { label: "Mixed Use", icon: Building2 },
      { label: "Public Squares", icon: Map },
    ],
  },
  {
    id: "creative",
    title: "Creative Scene",
    icon: Camera,
    color: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700",
    filters: [
      { label: "Art Galleries", icon: Camera },
      { label: "Live Music", icon: Music },
      { label: "Theater Scene", icon: Star },
      { label: "Creative Classes", icon: Star },
      { label: "Design Studios", icon: Heart },
      { label: "Film Location", icon: Camera },
      { label: "Street Art", icon: Camera },
      { label: "Cultural Events", icon: Music },
    ],
  },
  {
    id: "sports",
    title: "Sports & Recreation",
    icon: Users,
    color: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700",
    filters: [
      { label: "Pro Sports", icon: Star },
      { label: "Public Facilities", icon: Building2 },
      { label: "Running Routes", icon: Map },
      { label: "Water Sports", icon: Waves },
      { label: "Winter Sports", icon: Cloud },
      { label: "Adventure Sports", icon: Mountain },
      { label: "Sports Groups", icon: Users },
      { label: "Fitness Culture", icon: Heart },
    ],
  },
  {
    id: "eco",
    title: "Sustainability",
    icon: Leaf,
    color: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700",
    filters: [
      { label: "Clean Energy", icon: Leaf },
      { label: "Recycling", icon: Leaf },
      { label: "Green Buildings", icon: Building2 },
      { label: "Urban Gardens", icon: Leaf },
      { label: "Zero Waste", icon: Star },
      { label: "Bike Friendly", icon: Bike },
      { label: "Eco Policy", icon: Shield },
      { label: "Clean Air", icon: Wind },
    ],
  },
  {
    id: "residency",
    title: "Moving & Residency",
    icon: Home,
    color: "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700",
    filters: [
      { label: "Easy Visa", icon: Shield },
      { label: "Rental Market", icon: Home },
      { label: "Bank Access", icon: DollarSign },
      { label: "Simple Registration", icon: Shield },
      { label: "Insurance Options", icon: Shield },
      { label: "Tax Benefits", icon: DollarSign },
      { label: "Residency Path", icon: Shield },
      { label: "Nomad Friendly", icon: Globe },
    ],
  },
];

interface VerticalFiltersProps {
  onFiltersChange?: (filters: Set<string>) => void;
}

export function VerticalFilters({ onFiltersChange }: VerticalFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set()
  );

  const handleFilterToggle = (filter: string): void => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setSelectedFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const allCategories = [
    ...categories,
    navigationFilters,
    costFilters,
    ...newCategories,
  ];

  return (
    <div className="w-80 border-r h-[calc(100vh-4rem)] flex flex-col bg-white">
      <div className="p-4 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold">Filters</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedFilters.size} selected
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {allCategories.map((category) => (
            <FilterSection
              key={category.id}
              title={category.title}
              icon={category.icon}
              filters={category.filters}
              color={category.color}
              selectedFilters={selectedFilters}
              onFilterToggle={handleFilterToggle}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
