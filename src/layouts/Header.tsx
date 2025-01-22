import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton } from "@/features/auth/components/SignInButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Globe2,
  LogOut,
  ScrollText,
  Sparkles,
  Star,
  Upload,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Explore",
    mobileLabel: "Explore",
    icon: Globe2,
    to: "/",
    description: "Discover your next adventure on our interactive map",
    gradient: "from-sky-500 via-blue-500 to-cyan-500",
  },
  {
    label: "Collections",
    mobileLabel: "Lists",
    icon: ScrollText,
    to: "/lists",
    description: "Curate and share your favorite places",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
  },
  {
    label: "Live Feed",
    mobileLabel: "Live",
    icon: Sparkles,
    to: "/feed",
    description: "See what's happening around the world right now",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
  },
  {
    label: "Quests",
    mobileLabel: "Quests",
    icon: Star,
    to: "/quests",
    description: "Uncover hidden gems and trending spots",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
  },
];

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          "sticky top-0 z-[100] w-full transition-all duration-300",
          "relative",
          scrolled
            ? "bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80"
            : "bg-white/50 backdrop-blur-sm supports-[backdrop-filter]:bg-white/50"
        )}
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-1xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 group relative"
              onMouseEnter={() => setActiveHover("logo")}
              onMouseLeave={() => setActiveHover(null)}
            >
              <motion.div className="flex items-center gap-1">
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
                      WURLD
                    </span>
                    <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                      MAP
                    </span>
                  </div>
                </div>
                <div className="relative w-3 h-3">
                  <AnimatePresence>
                    {activeHover === "logo" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0"
                      >
                        {[0.6, 0.8, 1].map((opacity, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 bg-emerald-500 rounded-full"
                            animate={{
                              scale: [1, 2],
                              opacity: [opacity, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="relative w-full h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" />
                </div>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 left-0 right-0 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-sm font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-500">
                  Your World, UR Map
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onMouseEnter={() => setActiveHover(item.to)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <motion.div
                      className="relative px-3 py-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "relative h-10 rounded-lg font-bold transition-all duration-300",
                          "bg-white/80 hover:bg-white dark:hover:bg-white/90",
                          "border border-gray-200 hover:border-gray-300",
                          "shadow-sm hover:shadow-lg",
                          "backdrop-blur-md",
                          "transform hover:translate-y-[-1px]",
                          isActive && "bg-white border-gray-300 shadow-md"
                        )}
                      >
                        <div className="flex items-center gap-2 px-4">
                          <item.icon
                            className={cn(
                              "w-4 h-4 transition-all duration-300",
                              `bg-gradient-to-r ${item.gradient} bg-clip-text opacity-100`
                            )}
                          />
                          <span className="text-gray-800 dark:text-gray-900 font-medium">
                            {item.label}
                          </span>
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500"
                              transition={{
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.6,
                              }}
                            />
                          )}
                        </div>
                      </Button>

                      {/* Hover card */}
                      <AnimatePresence>
                        {activeHover === item.to && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 p-3 bg-white rounded-xl shadow-xl border border-gray-100"
                            style={{ zIndex: 1000 }}
                          >
                            <div className="text-sm text-gray-600">
                              {item.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 hover:bg-white"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
                      <AvatarImage src={user.avatar} alt={user.name ?? ""} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {user.name?.[0] ?? user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 p-2 backdrop-blur-lg bg-white/90"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>View Profile</span>
                      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>Saved Places</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {user.isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/import"
                          className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Import Data</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
        {/* Elegant border effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-200 to-transparent opacity-100" />
        <div className="absolute bottom-[-4px] left-0 right-0 h-[4px] bg-gradient-to-b from-gray-200/50 to-transparent" />
      </motion.header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-2 w-full",
                    "hover:bg-white/50",
                    "rounded-lg font-medium transition-all duration-300",
                    isActive && "bg-white/50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      `bg-gradient-to-r ${item.gradient} bg-clip-text`
                    )}
                  />
                  <span className="text-xs font-medium">
                    {item.mobileLabel}
                  </span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
