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
  Link2,
  Mail,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  MessageSquare,
  Share as ShareIcon,
} from "lucide-react";
import React, { useState } from "react";

interface SocialShareMenuProps {
  place: MapPlace;
}

export const SocialShareMenu: React.FC<SocialShareMenuProps> = ({ place }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://citiesrank.com/places/${place.id}`;
  const shareText = `Check out ${place.name} ${
    place.country ? `in ${place.country}` : ""
  } 🌎✨`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Silently fail - UI will remain in non-copied state
    }
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
          handleCopyLink(); // Fallback to copying if share fails
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-500/10 hover:text-blue-500",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-sky-500/10 hover:text-sky-500",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "hover:bg-pink-500/10 hover:text-pink-500",
      url: `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Message",
      icon: MessageSquare,
      color: "hover:bg-green-500/10 hover:text-green-500",
      url: `sms:?body=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
  ];

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-black/40 hover:border-white/30 transition-all duration-200"
          >
            <ShareIcon className="w-5 h-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 bg-background/95 backdrop-blur-sm z-[10000] p-3 rounded-xl border border-white/10"
          style={{ zIndex: 10000 }}
          forceMount
        >
          {/* Share Title */}
          <div className="mb-3 px-2">
            <h3 className="text-sm font-medium text-foreground/80">Share this place</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{shareText}</p>
          </div>

          {/* Quick Share Button */}
          <DropdownMenuItem
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors duration-200"
            onClick={handleShare}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">Quick Share</span>
              <span className="text-xs text-muted-foreground">
                Share to any app
              </span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-3 bg-border/50" />

          {/* Social Platforms Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {socialPlatforms.map(({ name, icon: Icon, color, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200",
                  "hover:scale-105",
                  color
                )}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(url, '_blank', 'width=600,height=400');
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{name}</span>
              </a>
            ))}
          </div>

          {/* Copy Link Button */}
          <DropdownMenuItem
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors duration-200"
            onClick={handleCopyLink}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {copied ? (
                <Check className="w-5 h-5 text-primary animate-in fade-in-0 zoom-in-95" />
              ) : (
                <Copy className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">
                {copied ? "Copied!" : "Copy Link"}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                {shareUrl}
              </span>
            </div>
          </DropdownMenuItem>

          {/* Email Option */}
          <DropdownMenuItem
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors duration-200 mt-1"
            onClick={() => {
              window.location.href = `mailto:?subject=${encodeURIComponent(
                `Check out ${place.name}`
              )}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;
            }}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">Email</span>
              <span className="text-xs text-muted-foreground">
                Share via email
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
