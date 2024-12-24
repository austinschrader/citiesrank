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
  Map,
  PenTool,
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
      label: "Map",
      mobileLabel: "MapSpace",
      icon: Map,
      to: "/",
      description: "Explore the world through places",
      iconClass: "text-indigo-500",
    },
    {
      label: "Your Places",
      mobileLabel: "Places",
      icon: PenTool,
      to: "/created-spaces",
      description: "Manage your contributed spaces",
      iconClass: "text-indigo-500",
      requiresAuth: true,
    },
    ...(user?.isAdmin
      ? [
          {
            label: "Import Data",
            mobileLabel: "Import",
            icon: Upload,
            to: "/admin/import",
            description: "Import places and feed items",
            iconClass: "text-emerald-500",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[calc(100%-4rem)] mx-auto">
        <div className="h-16 flex items-center">
          <div className="flex-none hidden md:block">
            <Link to="/" className="flex flex-col group">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text transition-all duration-300 group-hover:from-purple-500 group-hover:to-pink-500">
                TheMapSpace
              </span>
              <span className="text-sm text-muted-foreground transition-opacity duration-300 group-hover:opacity-80">
                The social layer of the world
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <nav className="hidden md:flex items-center gap-4">
              {navItems
                .filter((item) => !item.requiresAuth || user)
                .map((item) => (
                  <Link key={item.to} to={item.to}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-sm font-semibold hover:bg-gray-50/50 flex items-center gap-2 group relative transition-all duration-200 ease-in-out ${
                        location.pathname === item.to ? "bg-gray-100/80" : ""
                      }`}
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

      <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background md:hidden z-50">
        <nav className="container h-full">
          <div className="grid h-full grid-cols-4 items-stretch">
            {navItems
              .filter((item) => !item.requiresAuth || user)
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-center ${
                    location.pathname === item.to ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1 px-2 py-1">
                    <item.icon
                      className={`h-5 w-5 ${item.iconClass}`}
                      strokeWidth={2.5}
                    />
                    <span className="text-[10px] font-medium">
                      {item.mobileLabel}
                    </span>
                  </div>
                </Link>
              ))}
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className={`flex items-center justify-center ${
                    location.pathname === "/favorites" ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1 px-2 py-1">
                    <Bookmark
                      className="h-5 w-5 text-pink-500"
                      strokeWidth={2.5}
                    />
                    <span className="text-[10px] font-medium">Saved</span>
                  </div>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center justify-center ${
                    location.pathname === "/profile" ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-1 px-2 py-1">
                    <UserCircle
                      className="h-5 w-5 text-purple-500"
                      strokeWidth={2.5}
                    />
                    <span className="text-[10px] font-medium">Profile</span>
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-center col-span-2">
                <SignInButton />
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
