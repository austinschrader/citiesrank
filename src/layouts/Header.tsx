import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton } from "@/features/auth/components/SignInButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Bookmark,
  LogOut,
  MapPin,
  Scroll,
  Sparkles,
  Upload,
  UserCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const navItems = [
    {
      label: "Explore",
      mobileLabel: "Explore",
      icon: MapPin,
      to: "/",
      description: "Find your next favorite place on our interactive map",
      iconClass: "text-indigo-500",
    },
    {
      label: "All Collections",
      mobileLabel: "Lists",
      icon: Scroll,
      to: "/lists",
      description: "Create and organize lists of your favorite places",
      iconClass: "text-blue-500",
    },
    {
      label: "Happening Now",
      mobileLabel: "Now",
      icon: Sparkles,
      to: "/feed",
      description: "See the most recent updates and activity",
      iconClass: "text-green-500",
    },
    {
      label: "Achievements",
      mobileLabel: "Achieve",
      icon: Sparkles,
      to: "/discover",
      description: "Discover hidden gems and share your finds",
      iconClass: "text-purple-500",
    },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[calc(100%-4rem)] mx-auto">
        <div className="h-16 flex items-center">
          <div className="flex-none hidden md:block">
            <Link to="/" className="flex flex-col group">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                  WURLD
                </span>
                <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  MAP
                </span>
                <div className="relative w-3 h-3">
                  <div
                    className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"
                    style={{ animationDuration: "2s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40"
                    style={{ animationDuration: "1.5s" }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-60"
                    style={{ animationDuration: "1s" }}
                  ></div>
                  <div className="absolute inset-0 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></div>
                </div>
              </div>
              <div className="w-full text-center">
                <span className="text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent">
                  Your World, UR Map
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-semibold text-gray-900 hover:bg-gray-50/50 flex items-center gap-2 group relative transition-all duration-200 ease-in-out"
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.iconClass} transition-transform duration-200 group-hover:scale-110`}
                      strokeWidth={2.5}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {item.label}
                    </span>
                    {item.description && (
                      <div className="absolute hidden group-hover:block top-full left-1/2 transform -translate-x-1/2 mt-1 w-64 p-3 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 rounded-lg shadow-lg border border-border/40 whitespace-normal z-[100]">
                        {item.description}
                      </div>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <nav className="flex md:hidden items-center gap-2 flex-1 justify-around">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-1.5 px-3"
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.iconClass}`}
                      strokeWidth={2.5}
                    />
                    <span className="text-xs">{item.mobileLabel}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            {/* User menu section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 md:h-11 md:w-11 rounded-full shrink-0"
                  >
                    <Avatar className="h-7 w-7 md:h-9 md:w-9">
                      <AvatarImage src={user.avatar} alt={user.name ?? ""} />
                      <AvatarFallback>
                        {user.name?.[0] ?? user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 md:w-64 z-[9999]"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <UserCircle className="mr-2 h-5 w-5" />
                        View Profile
                        <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/favorites"
                        className="flex items-center cursor-pointer"
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    {user.isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin/import" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Import Data
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
