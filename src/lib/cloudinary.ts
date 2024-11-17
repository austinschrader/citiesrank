// src/lib/cloudinary.ts
import { Cloudinary } from "@cloudinary/url-gen";
import { improve } from "@cloudinary/url-gen/actions/adjust";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
  url: {
    secure: true,
  },
});

type ImageSize = "thumbnail" | "standard" | "large";

const SIZES: Record<ImageSize, { width: number; height: number; quality: number }> = {
  thumbnail: { width: 400, height: 300, quality: 70 },
  standard: { width: 800, height: 600, quality: 80 },
  large: { width: 1600, height: 1200, quality: 85 },
};

export const getImageUrl = (path: string, size: ImageSize = "standard") => {
  const { width, height } = SIZES[size];

  return cld.image(path).resize(thumbnail().width(width).height(height).gravity(autoGravity())).adjust(improve()).toURL();
};

export const getCityImage = (citySlug: string, size: ImageSize = "standard") => {
  return getImageUrl(citySlug, size);
};

export const getAttractionImage = (attractionSlug: string, size: ImageSize = "standard") => {
  return getImageUrl(attractionSlug, size);
};
