import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import { PopulationRange, PopulationRanges } from "@/lib/utils/populationUtils";
import {
  Bike,
  Building2,
  Camera,
  Car,
  Cloud,
  DollarSign,
  Globe,
  Globe2,
  Heart,
  Home,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Mountain,
  Music,
  Shield,
  Star,
  Sun,
  Users,
  Waves,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FilterItem {
  label: string;
  emoji: string;
  count?: number;
}

interface Category {
  id: string;
  title: string;
  emoji: string;
  color: string;
  filters: FilterItem[];
}

interface FilterSectionProps {
  title: string;
  filters: FilterItem[];
  emoji: string;
  color: string;
  selectedFilters: Set<string>;
  onFilterToggle: (filter: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface VerticalFiltersProps {
  onFiltersChange?: (filters: {
    types: Set<CitiesTypeOptions>;
    sizes: Set<PopulationRange>;
    tags: Set<string>;
  }) => void;
  selectedDestinationType?: CitiesTypeOptions | null;
  onDestinationTypeSelect?: (type: CitiesTypeOptions) => void;
}

const categories: Category[] = [
  {
    id: "basics",
    title: "Basic Essentials",
    emoji: "🛡️",
    color: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    filters: [
      { label: "Drinkable Tap Water", emoji: "🚰" },
      { label: "24/7 Convenience Stores", emoji: "🏪" },
      { label: "Easy SIM Cards", emoji: "📱" },
      { label: "ATMs Everywhere", emoji: "💳" },
      { label: "English at Hospitals", emoji: "🏥" },
      { label: "Reliable Power", emoji: "⚡" },
      { label: "Clean Public Toilets", emoji: "🚽" },
    ],
  },
  {
    id: "daily",
    title: "Daily Living",
    emoji: "☕",
    color: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    filters: [
      { label: "Good Supermarkets", emoji: "🛒" },
      { label: "Hardware Stores", emoji: "🔨" },
      { label: "Easy Laundry", emoji: "🧺" },
      { label: "Food Delivery 24/7", emoji: "🍜" },
      { label: "Late Night Shopping", emoji: "🌙" },
      { label: "Easy Package Delivery", emoji: "📦" },
    ],
  },
  {
    id: "annoyances",
    title: "Common Annoyances",
    emoji: "⚠️",
    color: "bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800",
    filters: [
      { label: "No Street Harassment", emoji: "🚫" },
      { label: "Low Traffic Noise", emoji: "🚗" },
      { label: "Clean Air", emoji: "🌬️" },
      { label: "No Scams", emoji: "🎭" },
    ],
  },
  {
    id: "specific-needs",
    title: "Specific Needs",
    emoji: "♿",
    color: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    filters: [
      { label: "Wheelchair Accessible", emoji: "♿" },
      { label: "Disability Support", emoji: "🤲" },
      { label: "Dietary Options", emoji: "🥗" },
      { label: "Religious Facilities", emoji: "🕌" },
      { label: "Cultural Support", emoji: "🤝" },
      { label: "Language Support", emoji: "💬" },
    ],
  },
  {
    id: "comfort",
    title: "Comfort & Convenience",
    emoji: "🛋️",
    color: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    filters: [
      { label: "Modern Amenities", emoji: "🏢" },
      { label: "Good Appliances", emoji: "🔌" },
      { label: "Easy Parking", emoji: "🅿️" },
      { label: "Home Delivery", emoji: "📦" },
      { label: "Cleaning Services", emoji: "🧹" },
      { label: "Maintenance Services", emoji: "🔧" },
      { label: "Storage Options", emoji: "📦" },
    ],
  },
  {
    id: "community",
    title: "Community & Social",
    emoji: "👥",
    color: "bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800",
    filters: [
      { label: "Friendly Locals", emoji: "🤝" },
      { label: "Expat Community", emoji: "🌏" },
      { label: "Family Friendly", emoji: "👨‍👩‍👧‍👦" },
      { label: "LGBTQ+ Friendly", emoji: "🌈" },
      { label: "Pet Friendly", emoji: "🐾" },
      { label: "Social Events", emoji: "🎉" },
      { label: "Dating Scene", emoji: "❤️" },
    ],
  },
  {
    id: "pets",
    title: "Pet Friendly",
    emoji: "🐶",
    color: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700",
    filters: [
      { label: "Dog Parks", emoji: "🦴" },
      { label: "Pet Cafes", emoji: "☕" },
      { label: "Vet Clinics", emoji: "🏥" },
      { label: "Pet Supplies", emoji: "🛍️" },
      { label: "Pet Sitters", emoji: "👩‍⚕️" },
      { label: "Dog-Friendly Transit", emoji: "🚇" },
    ],
  },
  {
    id: "work",
    title: "Remote Work",
    emoji: "💻",
    color: "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700",
    filters: [
      { label: "Cafes with Plugs", emoji: "☕" },
      { label: "Libraries with Wifi", emoji: "📚" },
      { label: "24/7 Workspaces", emoji: "⏰" },
      { label: "Backup Internet", emoji: "📶" },
      { label: "Phone Booths", emoji: "⭐" },
      { label: "Meeting Rooms", emoji: "👥" },
    ],
  },
  {
    id: "medical",
    title: "Healthcare Access",
    emoji: "🛡️",
    color: "bg-gradient-to-r from-cyan-100 to-sky-100 text-cyan-700",
    filters: [
      { label: "English Doctors", emoji: "🩺" },
      { label: "24/7 Pharmacies", emoji: "⏰" },
      { label: "Mental Health Care", emoji: "❤️" },
      { label: "Dental Care", emoji: "🦷" },
      { label: "Quality Hospitals", emoji: "🏥" },
      { label: "Health Insurance", emoji: "🛡️" },
    ],
  },
  {
    id: "season",
    title: "Best Season to Visit",
    emoji: "☀️",
    color:
      "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 hover:from-amber-200 hover:to-orange-200",
    filters: [
      { label: "Amazing in Spring", emoji: "🌸" },
      { label: "Summer Paradise", emoji: "🌞" },
      { label: "Fall Colors", emoji: "🍁" },
      { label: "Winter Magic", emoji: "❄️" },
      { label: "Good Year-Round", emoji: "🕒" },
      { label: "Peak Season Now", emoji: "⭐" },
      { label: "Off-Peak Deals", emoji: "💵" },
    ],
  },
  {
    id: "transport",
    title: "Getting Around",
    emoji: "🚆",
    color:
      "bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700 hover:from-sky-200 hover:to-blue-200",
    filters: [
      { label: "Metro System", emoji: "🚇" },
      { label: "Bike Lanes", emoji: "🚲" },
      { label: "Walkable Streets", emoji: "🚶‍♂️" },
      { label: "Night Transit", emoji: "🌙" },
      { label: "Easy Airport Access", emoji: "✈️" },
      { label: "Reliable Taxis", emoji: "🚕" },
      { label: "Good for Walking", emoji: "🗺️" },
    ],
  },
  {
    id: "wellness",
    title: "Health & Wellness",
    emoji: "❤️",
    color:
      "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 hover:from-rose-200 hover:to-pink-200",
    filters: [
      { label: "Yoga Studios", emoji: "🧘‍♀️" },
      { label: "Fitness Culture", emoji: "🏋️‍♂️" },
      { label: "Thermal Spas", emoji: "♨️" },
      { label: "Clean Air Index", emoji: "🌬️" },
      { label: "Outdoor Gyms", emoji: "🏔️" },
      { label: "Wellness Centers", emoji: "🏥" },
      { label: "Mental Health", emoji: "🧠" },
    ],
  },
  {
    id: "photography",
    title: "Photography & Views",
    emoji: "📷",
    color:
      "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 hover:from-violet-200 hover:to-purple-200",
    filters: [
      { label: "Sunset Spots", emoji: "🌅" },
      { label: "City Views", emoji: "🏙️" },
      { label: "Nature Shots", emoji: "🏞️" },
      { label: "Street Photography", emoji: "📸" },
      { label: "Historic Sites", emoji: "🏛️" },
      { label: "Hidden Spots", emoji: "🗺️" },
    ],
  },
  {
    id: "unique",
    title: "Unique Experiences",
    emoji: "🌟",
    color:
      "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700 hover:from-teal-200 hover:to-emerald-200",
    filters: [
      { label: "Local Festivals", emoji: "🎶" },
      { label: "Night Markets", emoji: "🌙" },
      { label: "Traditional Crafts", emoji: "🧵" },
      { label: "Local Secrets", emoji: "✨" },
      { label: "Cultural Shows", emoji: "🎭" },
      { label: "Food Tours", emoji: "🍴" },
    ],
  },
  {
    id: "architecture",
    title: "Architecture & Design",
    emoji: "🏢",
    color:
      "bg-gradient-to-r from-stone-100 to-zinc-100 text-stone-700 hover:from-stone-200 hover:to-zinc-200",
    filters: [
      { label: "Modern Design", emoji: "🏙️" },
      { label: "Historic Buildings", emoji: "🏰" },
      { label: "Famous Landmarks", emoji: "🗽" },
      { label: "Urban Planning", emoji: "🗺️" },
      { label: "Green Spaces", emoji: "🌳" },
      { label: "Public Art", emoji: "🎨" },
    ],
  },
  {
    id: "language",
    title: "Language & Communication",
    emoji: "🌍",
    color:
      "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 hover:from-indigo-200 hover:to-blue-200",
    filters: [
      { label: "English Common", emoji: "🇬🇧" },
      { label: "Easy to Learn", emoji: "📖" },
      { label: "Language Cafes", emoji: "☕" },
      { label: "Cultural Exchange", emoji: "🤝" },
      { label: "Language Schools", emoji: "🎓" },
    ],
  },
  {
    id: "safety",
    title: "Safety & Security",
    emoji: "🛡️",
    color:
      "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200",
    filters: [
      { label: "Safe at Night", emoji: "🌙" },
      { label: "Women Friendly", emoji: "👩" },
      { label: "LGBTQ+ Safe", emoji: "🏳️‍🌈" },
      { label: "Health Safety", emoji: "🏥" },
      { label: "Low Crime Rate", emoji: "🚔" },
      { label: "Political Stability", emoji: "⚖️" },
    ],
  },
  {
    id: "academic",
    title: "Academic & Research",
    emoji: "🎓",
    color:
      "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 hover:from-red-200 hover:to-rose-200",
    filters: [
      { label: "Universities", emoji: "🏫" },
      { label: "Research Centers", emoji: "🔬" },
      { label: "Public Libraries", emoji: "📚" },
      { label: "Study Spaces", emoji: "📖" },
      { label: "Academic Events", emoji: "📅" },
      { label: "Student Life", emoji: "👩‍🎓" },
    ],
  },
  {
    id: "business",
    title: "Business Environment",
    emoji: "💼",
    color:
      "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 hover:from-blue-200 hover:to-sky-200",
    filters: [
      { label: "Startup Scene", emoji: "🚀" },
      { label: "Business Centers", emoji: "🏢" },
      { label: "Networking Events", emoji: "🤝" },
      { label: "Tax Benefits", emoji: "💵" },
      { label: "Investment Hub", emoji: "📈" },
    ],
  },
  {
    id: "medical-tourism",
    title: "Medical Tourism",
    emoji: "🩺",
    color: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700",
    filters: [
      { label: "Hair Transplant Centers", emoji: "⭐" },
      { label: "Dental Tourism", emoji: "🦷" },
      { label: "Cosmetic Surgery", emoji: "✨" },
      { label: "Recovery Hotels", emoji: "🏨" },
      { label: "Medical Visas Easy", emoji: "📄" },
      { label: "English-Speaking Doctors", emoji: "🌍" },
      { label: "Medical Concierge", emoji: "🤝" },
      { label: "Wellness Centers", emoji: "❤️" },
    ],
  },
  {
    id: "business",
    title: "Business Travel",
    emoji: "💼",
    color: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700",
    filters: [
      { label: "Airport Lounges", emoji: "🛫" },
      { label: "Business Hotels", emoji: "🏢" },
      { label: "Conference Centers", emoji: "👥" },
      { label: "Fast Track Visa", emoji: "⏩" },
      { label: "Business District", emoji: "🏙️" },
      { label: "Express Transport", emoji: "🚆" },
      { label: "5G Coverage", emoji: "📶" },
    ],
  },
  {
    id: "religious",
    title: "Religious & Cultural",
    emoji: "🕌",
    color: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700",
    filters: [
      { label: "Halal Everywhere", emoji: "🕌" },
      { label: "Kosher Available", emoji: "✡️" },
      { label: "Prayer Rooms", emoji: "🙏" },
      { label: "Religious Sites", emoji: "⛪" },
      { label: "Modest Dress Area", emoji: "🧕" },
      { label: "Cultural Respect", emoji: "🤝" },
    ],
  },
  {
    id: "ethnic",
    title: "Ethnic Communities",
    emoji: "🌍",
    color: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700",
    filters: [
      { label: "Chinatown", emoji: "🏮" },
      { label: "Little India", emoji: "🌸" },
      { label: "Korean District", emoji: "🍚" },
      { label: "Arab Quarter", emoji: "🌙" },
      { label: "Latino Community", emoji: "🎶" },
      { label: "African Diaspora", emoji: "🌍" },
    ],
  },
  {
    id: "language",
    title: "Language Access",
    emoji: "🗣️",
    color: "bg-gradient-to-r from-sky-100 to-blue-100 text-sky-700",
    filters: [
      { label: "English Common", emoji: "🇬🇧" },
      { label: "Chinese Spoken", emoji: "🇨🇳" },
      { label: "Spanish Common", emoji: "🇪🇸" },
      { label: "Arabic Signs", emoji: "🇸🇦" },
      { label: "Hindi/Urdu Used", emoji: "🇮🇳" },
      { label: "Language Schools", emoji: "📖" },
    ],
  },
  {
    id: "senior",
    title: "Senior Travel",
    emoji: "❤️",
    color: "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700",
    filters: [
      { label: "Easy Terrain", emoji: "⛰️" },
      { label: "Medical Facilities", emoji: "🩺" },
      { label: "Senior Discounts", emoji: "💲" },
      { label: "Accessible Transit", emoji: "🚉" },
      { label: "Quiet Areas", emoji: "🌙" },
      { label: "Senior Communities", emoji: "👥" },
    ],
  },
  {
    id: "student",
    title: "Student Life",
    emoji: "🎓",
    color: "bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700",
    filters: [
      { label: "Student Housing", emoji: "🏢" },
      { label: "Student Discounts", emoji: "💸" },
      { label: "Study Spots", emoji: "📚" },
      { label: "Campus Life", emoji: "👥" },
      { label: "Part-time Jobs", emoji: "💼" },
      { label: "Student Bars", emoji: "🍻" },
    ],
  },
  {
    id: "lgbtq",
    title: "LGBTQ+ Travel",
    emoji: "❤️‍🔥",
    color: "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700",
    filters: [
      { label: "LGBTQ+ Venues", emoji: "⭐" },
      { label: "Pride Events", emoji: "🏳️‍🌈" },
      { label: "Safe Spaces", emoji: "🛡️" },
      { label: "Queer Culture", emoji: "❤️" },
      { label: "LGBTQ+ Healthcare", emoji: "🩺" },
      { label: "Community Centers", emoji: "🏘️" },
    ],
  },
  {
    id: "digital-nomad",
    title: "Digital Nomads",
    emoji: "💻",
    color: "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700",
    filters: [
      { label: "Nomad Communities", emoji: "👥" },
      { label: "Fast Internet", emoji: "📶" },
      { label: "Coliving Spaces", emoji: "🏠" },
      { label: "Cafes to Work", emoji: "☕" },
      { label: "Long-term Visas", emoji: "🛂" },
      { label: "Tech Meetups", emoji: "👥" },
    ],
  },
  {
    id: "family",
    title: "Family Travel",
    emoji: "👨‍👩‍👧‍👦",
    color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
    filters: [
      { label: "Kid-Friendly", emoji: "❤️" },
      { label: "Family Activities", emoji: "⭐" },
      { label: "Safe Parks", emoji: "⛰️" },
      { label: "Family Housing", emoji: "🏢" },
      { label: "Schools Nearby", emoji: "🎓" },
      { label: "Baby Facilities", emoji: "❤️" },
    ],
  },
];

const lifestyleFilters = {
  id: "lifestyle",
  title: "Lifestyle & Culture",
  emoji: "🎭",
  color: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800",
  filters: [
    { label: "Great Nightlife", emoji: "🌃" },
    { label: "Art Scene", emoji: "🎨" },
    { label: "Live Music", emoji: "🎵" },
    { label: "Food Scene", emoji: "🍳" },
    { label: "Cafe Culture", emoji: "☕" },
    { label: "Shopping", emoji: "🛍️" },
    { label: "Sports & Recreation", emoji: "⚽" },
    { label: "Cultural Events", emoji: "🎪" },
  ],
};

const navigationFilters = {
  id: "navigation",
  title: "Location & Scale",
  emoji: "🗺️",
  color: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
  filters: [
    { label: "Easy Public Transit", emoji: "🚇" },
    { label: "Walkable Streets", emoji: "🚶" },
    { label: "Good Bike Lanes", emoji: "🚲" },
    { label: "Near Nature", emoji: "🌳" },
    { label: "Close to Beach", emoji: "🏖️" },
    { label: "Airport Access", emoji: "✈️" },
  ],
};

const costFilters = {
  id: "cost",
  title: "Cost of Living",
  emoji: "💰",
  color: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800",
  filters: [
    { label: "Affordable Housing", emoji: "🏠" },
    { label: "Cheap Food", emoji: "🍽️" },
    { label: "Low Cost Transport", emoji: "🚌" },
    { label: "Affordable Healthcare", emoji: "🏥" },
    { label: "Budget Entertainment", emoji: "🎭" },
    { label: "Low Tax Rate", emoji: "📊" },
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

const educationFilters = {
  id: "education",
  title: "Education & Learning",
  emoji: "🎓",
  color: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
  filters: [
    { label: "Universities", emoji: "🏛️" },
    { label: "Language Schools", emoji: "📚" },
    { label: "International Schools", emoji: "🌍" },
    { label: "Libraries", emoji: "📖" },
    { label: "Study Groups", emoji: "👥" },
    { label: "Cultural Classes", emoji: "🎭" },
    { label: "Online Learning", emoji: "💻" },
  ],
};

const nomadFilters = {
  id: "nomad",
  title: "Digital Nomad",
  emoji: "🌎",
  color: "bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800",
  filters: [
    { label: "Nomad Community", emoji: "👥" },
    { label: "Visa Friendly", emoji: "📄" },
    { label: "Good Cafes", emoji: "☕" },
    { label: "Coworking Spaces", emoji: "💼" },
    { label: "Short-term Housing", emoji: "🏠" },
    { label: "Payment Apps", emoji: "📱" },
    { label: "Travel Hub", emoji: "✈️" },
  ],
};

const familyFilters = {
  id: "family",
  title: "Family Travel",
  emoji: "👨‍👩‍👧‍👦",
  color: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800",
  filters: [
    { label: "Kid-Friendly Activities", emoji: "🎪" },
    { label: "Safe for Children", emoji: "🛡️" },
    { label: "Good Schools", emoji: "🏫" },
    { label: "Parks & Playgrounds", emoji: "🎡" },
    { label: "Family Healthcare", emoji: "👨‍⚕️" },
    { label: "Baby Supplies", emoji: "🍼" },
    { label: "Child Care", emoji: "👶" },
  ],
};

const techFilters = {
  id: "tech",
  title: "Tech & Work",
  emoji: "💻",
  color: "bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800",
  filters: [
    { label: "Fast Internet", emoji: "📶" },
    { label: "Good Coworking", emoji: "🏢" },
    { label: "Tech Hub", emoji: "🚀" },
    { label: "Startup Scene", emoji: "💡" },
    { label: "Remote Work Friendly", emoji: "🏠" },
    { label: "Digital Nomad Hub", emoji: "🌍" },
  ],
};

const weatherFilters = {
  id: "weather",
  title: "Weather & Climate",
  emoji: "🌤️",
  color: "bg-gradient-to-r from-sky-100 to-sky-200 text-sky-800",
  filters: [
    { label: "Warm Weather", emoji: "☀️" },
    { label: "Cool Weather", emoji: "❄️" },
    { label: "Mild Weather", emoji: "🌡️" },
    { label: "Low Humidity", emoji: "💧" },
    { label: "No Natural Disasters", emoji: "🌪️" },
    { label: "Clear Skies", emoji: "☁️" },
  ],
};

const healthcareFilters = {
  id: "healthcare",
  title: "Healthcare & Wellness",
  emoji: "⚕️",
  color: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
  filters: [
    { label: "Good Hospitals", emoji: "🏥" },
    { label: "English Doctors", emoji: "👨‍⚕️" },
    { label: "Mental Health Care", emoji: "🧠" },
    { label: "Pharmacies", emoji: "💊" },
    { label: "Dental Care", emoji: "🦷" },
    { label: "Fitness Centers", emoji: "🏋️" },
    { label: "Health Insurance", emoji: "📋" },
  ],
};

const petFilters = {
  id: "pets",
  title: "Pet Friendly",
  emoji: "🐾",
  color: "bg-gradient-to-r from-lime-100 to-lime-200 text-lime-800",
  filters: [
    { label: "Pet Supplies", emoji: "🦮" },
    { label: "Veterinarians", emoji: "👨‍⚕️" },
    { label: "Dog Parks", emoji: "🌳" },
    { label: "Pet Sitters", emoji: "👥" },
    { label: "Pet-Friendly Housing", emoji: "🏠" },
    { label: "Pet Grooming", emoji: "✂️" },
    { label: "Pet-Friendly Cafes", emoji: "☕" },
  ],
};

const remoteWorkFilters = {
  id: "remote-work",
  title: "Remote Work",
  emoji: "💼",
  color: "bg-gradient-to-r from-violet-100 to-violet-200 text-violet-800",
  filters: [
    { label: "Fast WiFi", emoji: "📶" },
    { label: "Backup Internet", emoji: "🔄" },
    { label: "Quiet Workspace", emoji: "🤫" },
    { label: "Power Stability", emoji: "🔌" },
    { label: "Time Zone Friendly", emoji: "🕒" },
    { label: "Work Community", emoji: "👥" },
    { label: "Meeting Spaces", emoji: "🏢" },
  ],
};

const healthcareAccessFilters = {
  id: "healthcare-access",
  title: "Healthcare Access",
  emoji: "🏥",
  color: "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800",
  filters: [
    { label: "24/7 Emergency Care", emoji: "🚑" },
    { label: "Insurance Accepted", emoji: "📋" },
    { label: "Specialists Available", emoji: "👨‍⚕️" },
    { label: "Telehealth Options", emoji: "📱" },
    { label: "Pharmacy Access", emoji: "💊" },
    { label: "Medical Tourism", emoji: "✈️" },
    { label: "Mental Health Access", emoji: "🧠" },
  ],
};

const seasonFilters = {
  id: "seasons",
  title: "Best Season to Visit",
  emoji: "🗓️",
  color: "bg-gradient-to-r from-fuchsia-100 to-fuchsia-200 text-fuchsia-800",
  filters: [
    { label: "Spring Perfect", emoji: "🌸" },
    { label: "Summer Ideal", emoji: "☀️" },
    { label: "Fall Beautiful", emoji: "🍂" },
    { label: "Winter Wonderful", emoji: "❄️" },
    { label: "Year-Round Good", emoji: "🌍" },
    { label: "Festival Season", emoji: "🎪" },
    { label: "Off-Peak Best", emoji: "📉" },
  ],
};

const placeTypeFilters = [
  { type: CitiesTypeOptions.country, label: "Countries", icon: Globe2 },
  { type: CitiesTypeOptions.region, label: "Regions", icon: Mountain },
  { type: CitiesTypeOptions.city, label: "Cities", icon: Building2 },
  {
    type: CitiesTypeOptions.neighborhood,
    label: "Neighborhoods",
    icon: MapPin,
  },
  { type: CitiesTypeOptions.sight, label: "Sights", icon: Landmark },
];

const destinationTypes = [
  {
    type: CitiesTypeOptions.country,
    label: "Countries",
    icon: Globe2,
  },
  {
    type: CitiesTypeOptions.region,
    label: "Regions",
    icon: Mountain,
  },
  {
    type: CitiesTypeOptions.city,
    label: "Cities",
    icon: Building2,
  },
  {
    type: CitiesTypeOptions.neighborhood,
    label: "Neighborhoods",
    icon: MapPin,
  },
  {
    type: CitiesTypeOptions.sight,
    label: "Sights",
    icon: Landmark,
  },
];

const FilterSection = ({
  title,
  filters,
  emoji,
  color,
  selectedFilters,
  onFilterToggle,
  isCollapsed,
  onToggleCollapse,
}: FilterSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Button
        variant="ghost"
        className={`w-full justify-between px-4 py-2 ${color} rounded-t-lg`}
        onClick={onToggleCollapse}
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-medium">{title}</span>
        </span>
        <span
          className={`transform transition-transform ${
            isCollapsed ? "" : "rotate-180"
          }`}
        >
          ▼
        </span>
      </Button>
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          {filters.map((filter) => (
            <Button
              key={filter.label}
              variant={
                selectedFilters.has(filter.label) ? "default" : "outline"
              }
              className="w-full justify-start gap-2"
              onClick={() => onFilterToggle(filter.label)}
            >
              <span className="text-lg">{filter.emoji}</span>
              {filter.label}
              {filter.count !== undefined && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {filter.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export function VerticalFilters({
  onFiltersChange,
  selectedDestinationType,
  onDestinationTypeSelect,
}: VerticalFiltersProps) {
  const { user } = useAuth();
  const [selectedTypes, setSelectedTypes] = useState<Set<CitiesTypeOptions>>(
    new Set()
  );
  const [selectedSizes, setSelectedSizes] = useState<Set<PopulationRange>>(
    new Set()
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);

  useEffect(() => {
    onFiltersChange?.({
      types: selectedTypes,
      sizes: selectedSizes,
      tags: selectedTags,
    });
  }, [selectedTypes, selectedSizes, selectedTags, onFiltersChange]);

  const handleTypeToggle = (type: CitiesTypeOptions) => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedTypes(newTypes);
  };

  const handleSizeToggle = (size: PopulationRange) => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }
    const newSizes = new Set(selectedSizes);
    if (newSizes.has(size)) {
      newSizes.delete(size);
    } else {
      newSizes.add(size);
    }
    setSelectedSizes(newSizes);
  };

  const handleTagToggle = (tag: string) => {
    if (!user) {
      setShowSignUpDialog(true);
      return;
    }
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  return (
    <div className="w-full max-w-xs flex flex-col gap-6">
      <div className="space-y-2">
        <Input
          placeholder="Search filters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Place Type Filters */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-t-lg"
          onClick={() => {
            const newCollapsed = new Set(collapsedSections);
            if (newCollapsed.has("types")) {
              newCollapsed.delete("types");
            } else {
              newCollapsed.add("types");
            }
            setCollapsedSections(newCollapsed);
          }}
        >
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">Place Type</span>
          </span>
          <span
            className={`transform transition-transform ${
              collapsedSections.has("types") ? "" : "rotate-180"
            }`}
          >
            ▼
          </span>
        </Button>
        {!collapsedSections.has("types") && (
          <div className="p-4 space-y-2">
            {destinationTypes.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant={
                  selectedDestinationType === type ? "default" : "outline"
                }
                className="w-full justify-start gap-2"
                onClick={() => onDestinationTypeSelect?.(type)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Population Size Filters */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-t-lg"
          onClick={() => {
            const newCollapsed = new Set(collapsedSections);
            if (newCollapsed.has("sizes")) {
              newCollapsed.delete("sizes");
            } else {
              newCollapsed.add("sizes");
            }
            setCollapsedSections(newCollapsed);
          }}
        >
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">Population Size</span>
          </span>
          <span
            className={`transform transition-transform ${
              collapsedSections.has("sizes") ? "" : "rotate-180"
            }`}
          >
            ▼
          </span>
        </Button>
        {!collapsedSections.has("sizes") && (
          <div className="p-4 space-y-2">
            {(
              Object.entries(PopulationRanges) as [
                PopulationRange,
                { label: string }
              ][]
            ).map(([size, { label }]) => (
              <Button
                key={size}
                variant={
                  selectedSizes.has(size as PopulationRange)
                    ? "default"
                    : "outline"
                }
                className="w-full justify-start gap-2"
                onClick={() => handleSizeToggle(size as PopulationRange)}
              >
                <Users className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Original Tag Filters */}
      {categories
        .filter((category) =>
          category.filters.some((filter) =>
            filter.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
        .map((category) => (
          <FilterSection
            key={category.id}
            title={category.title}
            filters={category.filters.filter((filter) =>
              filter.label.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            emoji={category.emoji}
            color={category.color}
            selectedFilters={selectedTags}
            onFilterToggle={handleTagToggle}
            isCollapsed={collapsedSections.has(category.id)}
            onToggleCollapse={() => {
              const newCollapsed = new Set(collapsedSections);
              if (newCollapsed.has(category.id)) {
                newCollapsed.delete(category.id);
              } else {
                newCollapsed.add(category.id);
              }
              setCollapsedSections(newCollapsed);
            }}
          />
        ))}

      {showSignUpDialog && (
        <SignUpDialog
          open={showSignUpDialog}
          onOpenChange={setShowSignUpDialog}
          title="Unlock All Filters"
          description="Join our community to access all filters and discover your perfect city"
          city="paris"
          country="france"
          imageNumber={4}
        />
      )}
    </div>
  );
}
