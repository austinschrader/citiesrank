import { cva, VariantProps } from "class-variance-authority";

export const galleryWrapper = cva(
  // Base styles
  "relative overflow-hidden rounded-xl bg-neutral-100 transition-all duration-300 group",
  {
    variants: {
      isFullscreen: {
        true: "fixed inset-0 z-50 bg-black/90",
        false: "aspect-[16/10] cursor-zoom-in",
      },
    },
    defaultVariants: {
      isFullscreen: false,
    },
  }
);

export const galleryControls = cva(
  // Base styles
  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200", // Fixed base styles
  {
    variants: {
      visible: {
        true: "!opacity-100", // Added ! to force override
        false: "",
      },
    },
    defaultVariants: {
      visible: false,
    },
  }
);

export const galleryStyles = {
  container: "relative",
  closeButton: [
    "absolute right-4 top-4 z-[60]", // Added z-index
    "bg-white/90 hover:bg-white", // Added hover state
    "p-2 rounded-full",
    "hover:scale-110 active:scale-95",
    "transition-all",
    "shadow-[0_2px_8px_rgba(0,0,0,0.16)]",
  ].join(" "),
  caption: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6",
  captionText: "text-white text-base font-medium",
} as const;

// Export type for type safety
export type GalleryWrapperVariants = VariantProps<typeof galleryWrapper>;
export type GalleryControlsVariants = VariantProps<typeof galleryControls>;
