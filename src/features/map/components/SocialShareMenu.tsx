import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPlace } from "@/features/map/types";
import { cn } from "@/lib/utils";
import {
  Check,
  Facebook,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";
import React, { useState } from "react";

interface SocialShareMenuProps {
  place: MapPlace;
}

export const SocialShareMenu: React.FC<SocialShareMenuProps> = ({ place }) => {
  const [copied, setCopied] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const shareUrl = `https://citiesrank.com/places/${place.id}`;
  const shareText = `Check out ${place.name} ${
    place.country ? `in ${place.country}` : ""
  } 🌎✨`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20"
          >
            <Share2 className="w-5 h-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-60 bg-background/95 backdrop-blur-sm"
        >
          {/* Quick Share Button for Mobile */}
          <DropdownMenuItem
            className="flex items-center gap-2 p-3"
            onClick={handleShare}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Quick Share</span>
              <span className="text-xs text-muted-foreground">
                Share to any app
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Social Share Options */}
          <div className="p-2 grid grid-cols-4 gap-1">
            {[
              {
                icon: Twitter,
                label: "Twitter",
                color: "hover:bg-blue-500/10",
              },
              {
                icon: Facebook,
                label: "Facebook",
                color: "hover:bg-blue-600/10",
              },
              {
                icon: Instagram,
                label: "Instagram",
                color: "hover:bg-pink-500/10",
              },
              {
                icon: MessageCircle,
                label: "Message",
                color: "hover:bg-green-500/10",
              },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                  color
                )}
                onClick={handleShare}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>

          <DropdownMenuSeparator />

          {/* Copy Link Button */}
          <DropdownMenuItem
            className="flex items-center gap-2 p-3"
            onClick={handleCopyLink}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {copied ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Link2 className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {copied ? "Copied!" : "Copy Link"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {shareUrl}
              </span>
            </div>
          </DropdownMenuItem>

          {/* Email Option */}
          <DropdownMenuItem
            className="flex items-center gap-2 p-3"
            onClick={() => {
              window.location.href = `mailto:?subject=${encodeURIComponent(
                `Check out ${place.name}`
              )}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
            }}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Email</span>
              <span className="text-xs text-muted-foreground">
                Share via email
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Toast */}
      <div
        className={cn(
          "absolute top-12 right-0 bg-background/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border transition-all duration-200",
          showShareToast
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <p className="text-sm whitespace-nowrap">
          Link copied to clipboard! 🎉
        </p>
      </div>
    </div>
  );
};
