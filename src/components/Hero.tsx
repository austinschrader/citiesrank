import { Input } from "@/components/ui/input";
import { SignUpDialog } from "@/features/auth/components/SignUpDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getImageUrl } from "@/lib/cloudinary";
import { Search } from "lucide-react";
import { useState } from "react";

type PlaceType = "countries" | "regions" | "cities" | "sights";

const PLACE_TYPES: {
  id: PlaceType;
  label: string;
  placeholder: string;
  header: string;
}[] = [
  {
    id: "countries",
    label: "Countries",
    placeholder: "Search for countries to explore...",
    header: "Find your perfect country to call home",
  },
  {
    id: "regions",
    label: "Regions",
    placeholder: "Find your perfect region...",
    header: "Discover the best region for your lifestyle",
  },
  {
    id: "cities",
    label: "Cities",
    placeholder: "Discover cities worldwide...",
    header: "Find your perfect city to live in",
  },
  {
    id: "sights",
    label: "Sights",
    placeholder: "Explore amazing attractions...",
    header: "Explore the world's most amazing places",
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
      <div className="relative h-[60vh] sm:h-[50vh] overflow-hidden">
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
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8 drop-shadow-md min-h-[80px] leading-tight">
              {activeTabData.header}
            </h1>

            {/* Search Section */}
            <div className="mt-4">
              {/* Tabs and Search Container */}
              <div className="flex flex-col w-full sm:max-w-xl">
                {/* Tabs */}
                <div className="pl-0 sm:pl-2 mb-[-8px] relative z-10 overflow-x-auto">
                  <div className="flex gap-0.5 text-xs min-w-max">
                    {PLACE_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setActiveTab(type.id)}
                        className={`
                          px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4 text-xs sm:text-sm font-medium
                          transition-all duration-200
                          relative rounded-tl-md rounded-tr-md border-3 
                          ${
                            activeTab === type.id
                              ? "bg-white text-gray-900 border-indigo-400/70"
                              : "bg-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 hover:border-indigo-300/50 border-transparent hover:shadow-sm"
                          }
                        `}
                      >
                        {type.label}
                      </button>
                    ))}
                    <button
                      className="px-3 sm:px-4 pt-2 sm:pt-3 pb-3 sm:pb-4 text-xs sm:text-sm font-medium bg-red-500 text-white rounded-tl-md rounded-tr-md hover:bg-red-600 hover:shadow-sm transition-all duration-200 ml-1 border-3 border-transparent hover:border-red-400/50"
                      onClick={() => {
                        /* Add viral locations handler */
                      }}
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
                      placeholder="Search any city, region, or country to explore..."
                      className="rounded-md bg-white text-gray-900 text-base sm:text-lg py-6 sm:py-8 pl-10 sm:pl-12 pr-12 sm:pr-14
                        placeholder:text-gray-500 border-[3px] border-transparent
                        focus:border-indigo-400/70 focus:outline-none transition-colors duration-200
                        shadow-none ring-0 focus:ring-0 hover:border-gray-100
                        w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 sm:h-6 w-5 sm:w-6 text-gray-400" />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2
                        bg-gradient-to-r from-indigo-500 to-purple-600 
                        text-white rounded-md shadow-md
                        hover:from-indigo-600 hover:to-purple-700
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <Search className="h-4 sm:h-5 w-4 sm:w-5" />
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
