import { cva, type VariantProps } from "class-variance-authority";

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
export type GalleryControlsVariants = VariantProps<typeof galleryControls>;
