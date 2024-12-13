import { Input } from "@/components/ui/input";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getImageUrl } from "@/lib/cloudinary";
import { Search } from "lucide-react";
import { useState } from "react";

type PlaceType = "countries" | "regions" | "cities" | "sights";

const PLACE_TYPES: { id: PlaceType; label: string; placeholder: string }[] = [
  {
    id: "countries",
    label: "Countries",
    placeholder: "Search for countries to explore...",
  },
  {
    id: "regions",
    label: "Regions",
    placeholder: "Find your perfect region...",
  },
  {
    id: "cities",
    label: "Cities",
    placeholder: "Discover cities worldwide...",
  },
  {
    id: "sights",
    label: "Sights",
    placeholder: "Explore amazing attractions...",
  },
];

export const Hero = () => {
  const { user } = useAuth();
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PlaceType>("countries");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
  };

  const activeTabData = PLACE_TYPES.find((type) => type.id === activeTab)!;

  return (
    <div className="relative">
      {/* Hero Content */}
      <div className="relative h-[50vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={getImageUrl("bordeaux-france-1", "wide")}
            alt="Beautiful travel destination"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4 drop-shadow-md">
              Discover & organize your perfect
              <br />
              <span className="text-indigo-300">travel destinations</span>
            </h1>
            <p className="text-xl text-gray-200 mb-6 drop-shadow-md">
              Filter, categorize, and rank locations worldwide based on your unique preferences
            </p>

            {/* Search Section */}
            <div className="mt-4">
              {/* Tabs and Search Container */}
              <div className="flex flex-col max-w-md">
                {/* Tabs */}
                <div className="pl-2 mb-[-8px] relative z-10">
                  <div className="flex gap-0.5 text-xs">
                    {PLACE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setActiveTab(type.id)}
                        className={`
                          px-4 pt-2 pb-3 text-sm font-medium
                          transition-colors duration-200
                          relative rounded-tl-md rounded-tr-md
                          ${
                            activeTab === type.id
                              ? "bg-white text-gray-900 shadow-sm"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        {type.label}
                      </button>
                    ))}
                    <button
                      className="px-4 pt-2 pb-3 text-sm font-medium bg-red-500 text-white rounded-tl-md rounded-tr-md hover:bg-red-600 transition-colors duration-200 ml-1"
                      onClick={() => {/* Add viral locations handler */}}
                    >
                      🔥 Viral
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative z-20">
                  <form
                    onSubmit={handleSearch}
                    className="flex shadow-lg relative"
                  >
                    <Input
                      type="text"
                      placeholder={activeTabData.placeholder}
                      className="rounded-md bg-white text-gray-900 text-base py-6 pl-10 pr-14
                        placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2
                        bg-gradient-to-r from-indigo-500 to-purple-600 
                        text-white rounded-md shadow-md
                        hover:from-indigo-600 hover:to-purple-700
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Dialog */}
      <SignUpDialog
        open={showSignUpDialog}
        onOpenChange={setShowSignUpDialog}
      />
    </div>
  );
};
