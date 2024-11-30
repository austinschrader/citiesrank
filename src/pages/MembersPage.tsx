import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  Globe,
  Twitter,
  Instagram,
  Trophy,
  MessageCircle,
  UserPlus,
  Filter,
  ListFilter,
  GlobeIcon,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PocketBase from "pocketbase";
import { UsersResponse, UsersRecord } from "@/pocketbase-types";
import { useAuth } from "@/features/auth/hooks/useAuth";
// Types
interface MemberProfile {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  location?: string;
  bio?: string;
  created: string;
  lists_count?: number;
  places_visited?: string[];
  verified: boolean;
}

const MemberCard = ({ member }: { member: MemberProfile }) => {
  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar || "/default-avatar.png"} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{member.name}</h3>
                {member.verified && (
                  <Badge variant="secondary" className="h-5">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                @{member.username}
              </p>
              {member.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{member.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {member.bio && (
          <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
        )}
        <div className="flex justify-between text-center">
          <div>
            <p className="font-semibold">{member.lists_count || 0}</p>
            <p className="text-xs text-muted-foreground">Lists</p>
          </div>
          <div>
            <p className="font-semibold">
              {member.places_visited?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Places Visited</p>
          </div>
          <div>
            <p className="font-semibold">
              {new Date(member.created).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">Joined</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button variant="secondary" className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </Button>
      </CardFooter>
    </Card>
  );
};

export function MembersPage() {
  const { pb } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterLocation, setFilterLocation] = useState("");
  const [users, setUsers] = useState<Array<UsersResponse>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get avatar URL
  const getAvatarUrl = (user: UsersResponse) => {
    if (!user?.avatar) return "";
    return pb.files.getUrl(user, user.avatar);
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const resultList = await pb
          .collection("users")
          .getList<UsersResponse>(1, 50, {
            sort: sortBy === "recent" ? "-created" : "-username",
            filter: searchQuery
              ? `name ~ "${searchQuery}" || username ~ "${searchQuery}"`
              : "",
          });
        setUsers(resultList.items);
        setError(null);
      } catch (err) {
        setError("Failed to load users");
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [searchQuery, sortBy, pb]);

  const filteredMembers = users.filter((user) => {
    if (!filterLocation) return true;
    return user.location?.toLowerCase().includes(filterLocation.toLowerCase());
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
      <div className="mx-8 2xl:mx-16 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Members</h1>
            <p className="text-muted-foreground max-w-2xl">
              Connect with passionate travelers, local experts, and culture
              enthusiasts from around the world.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Browse By</h3>
                <div className="space-y-1">
                  <Button
                    variant={sortBy === "popular" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSortBy("popular")}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Popular Members
                  </Button>
                  <Button
                    variant={sortBy === "recent" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSortBy("recent")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Recent Joiners
                  </Button>
                  <Button
                    variant={sortBy === "active" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSortBy("active")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Most Active
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Filter By</h3>
                <div className="space-y-2">
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <GlobeIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger>
                      <ListFilter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Expertise</SelectItem>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="family">Family Travel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredMembers.length}
                </span>{" "}
                members
              </p>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Active</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                  <SelectItem value="contributions">
                    Top Contributors
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMembers.map((user) => (
                  <MemberCard
                    key={user.id}
                    member={{
                      id: user.id,
                      name: user.name || user.username,
                      username: user.username,
                      avatar: getAvatarUrl(user),
                      location: user.location,
                      bio: user.bio,
                      created: user.created,
                      lists_count: user.lists_count,
                      places_visited: user.places_visited,
                      verified: user.verified,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
