import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import React from "react";
import {
  ACTIVE_CHALLENGES,
  MOCK_DISCOVERIES,
  MOCK_USER,
} from "../data/mockData";

export const DiscoverView: React.FC = () => {
  console.log("DiscoverView mounted");
  console.log("Mock data:", { MOCK_DISCOVERIES, ACTIVE_CHALLENGES, MOCK_USER });

  return (
    <div className="flex h-screen">
      {/* Main Feed */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* User Progress Bar */}
          <div
            className={cn(
              "bg-card rounded-lg p-4 mb-6",
              "transform transition-all duration-300",
              "hover:scale-[1.01] hover:shadow-lg"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full bg-primary",
                    "flex items-center justify-center",
                    "text-primary-foreground font-bold",
                    "animate-pulse"
                  )}
                >
                  {MOCK_USER.level}
                </div>
                <div>
                  <h3 className="font-semibold">{MOCK_USER.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Level {MOCK_USER.level} Explorer
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Next Level: {MOCK_USER.nextLevel.title}
                </p>
                <p className="text-sm font-medium">
                  {MOCK_USER.points} / {MOCK_USER.nextLevel.points} XP
                </p>
              </div>
            </div>
            <Progress
              value={(MOCK_USER.points / MOCK_USER.nextLevel.points) * 100}
              className="h-2"
            />
          </div>

          {/* Active Challenge */}
          <div
            className={cn(
              "bg-card rounded-lg p-4 mb-6",
              "transform transition-all duration-300",
              "hover:scale-[1.01] hover:shadow-lg"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Active Challenge</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="bg-accent rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{ACTIVE_CHALLENGES[0].title}</h4>
                <span className="text-sm text-muted-foreground">
                  {ACTIVE_CHALLENGES[0].timeLeft} left
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {ACTIVE_CHALLENGES[0].description}
              </p>
              <Progress
                value={
                  (ACTIVE_CHALLENGES[0].progress.current /
                    ACTIVE_CHALLENGES[0].progress.total) *
                  100
                }
                className="h-2 mb-2"
              />
              <div className="flex items-center justify-between text-sm">
                <span>
                  {ACTIVE_CHALLENGES[0].progress.current}/
                  {ACTIVE_CHALLENGES[0].progress.total} completed
                </span>
                <span>{ACTIVE_CHALLENGES[0].participants} participants</span>
              </div>
            </div>
          </div>

          {/* Discover Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_DISCOVERIES.map((discover) => (
              <div
                key={discover.id}
                className={cn(
                  "bg-card rounded-lg overflow-hidden shadow-lg",
                  "transform transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-xl",
                  "active:scale-[0.98]"
                )}
              >
                <div className="relative aspect-square">
                  <img
                    src={discover.imageUrl}
                    alt={discover.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full bg-primary",
                          "flex items-center justify-center",
                          "text-xs font-medium text-primary-foreground",
                          "animate-pulse"
                        )}
                      >
                        {discover.user?.level || ""}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {discover.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          by {discover.user?.name || "Unknown"}
                        </p>
                      </div>
                    </div>
                    {discover.type === "challenge" && discover.progress && (
                      <div className="mt-2">
                        <Progress
                          value={
                            (discover.progress.current /
                              discover.progress.total) *
                            100
                          }
                          className="h-1.5"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    {discover.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        className={cn(
                          "text-muted-foreground hover:text-primary",
                          "transition-colors duration-200",
                          "hover:animate-heartbeat"
                        )}
                      >
                        ❤️ {discover.stats?.likes || 0}
                      </button>
                      <button
                        className={cn(
                          "text-muted-foreground hover:text-primary",
                          "transition-colors duration-200",
                          "hover:animate-bounce"
                        )}
                      >
                        💬 {discover.stats?.comments || 0}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        2h ago
                      </span>
                      {discover.points && (
                        <span
                          className={cn(
                            "text-sm font-medium text-primary",
                            "animate-pulse"
                          )}
                        >
                          +{discover.points}pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 border-l bg-card p-4 overflow-auto hidden lg:block">
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Your Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(MOCK_USER.stats)
              .slice(0, 4)
              .map(([key, value]) => (
                <div
                  key={key}
                  className={cn(
                    "bg-accent rounded-lg p-3",
                    "transform transition-all duration-300",
                    "hover:scale-[1.05] hover:shadow-md"
                  )}
                >
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {key}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Recent Badges</h3>
          <div className="space-y-3">
            {MOCK_USER.recentBadges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "flex items-center gap-3 bg-accent rounded-lg p-3",
                  "transform transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-md"
                )}
              >
                <div className="text-2xl animate-bounce">{badge.icon}</div>
                <div>
                  <p className="font-medium">{badge.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Earned {badge.earnedDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "#hiddengems",
              "#streetart",
              "#foodie",
              "#architecture",
              "#nature",
            ].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className={cn(
                  "transform transition-all duration-300",
                  "hover:scale-[1.05]"
                )}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
