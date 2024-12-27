// src/lib/bunny.ts

const CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL;

if (!CDN_URL) {
  throw new Error('VITE_BUNNY_CDN_URL is not defined');
}

type ImageSize =
  | "thumbnail"
  | "standard"
  | "large"
  | "wide"
  | "mobile"
  | "tablet"
  | "desktop"
  | "fullscreen";

const SIZES: Record<
  ImageSize,
  { width: number; height: number; quality: number }
> = {
  thumbnail: { width: 400, height: 300, quality: 70 },
  standard: { width: 800, height: 600, quality: 80 },
  large: { width: 1600, height: 1200, quality: 85 },
  wide: { width: 2400, height: 1600, quality: 90 },
  mobile: { width: 412, height: 915, quality: 90 },
  tablet: { width: 800, height: 600, quality: 80 },
  desktop: { width: 1600, height: 1200, quality: 100 },
  fullscreen: { width: 2400, height: 1600, quality: 90 },
};

const getBaseUrl = () => {
  return CDN_URL.startsWith('http') ? CDN_URL : `https://${CDN_URL}`;
};

export const getImageUrl = (path: string, size: ImageSize = "standard") => {
  const { width, height, quality } = SIZES[size];
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${path}?width=${width}&height=${height}&quality=${quality}&format=webp`;
};

export const getPlaceImage = (
  cityName: string,
  countryName: string,
  index: number = 1,
  size: ImageSize = "standard"
): string => {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const countrySlug = countryName.toLowerCase().replace(/\s+/g, '-');
  return getImageUrl(`${citySlug}-${countrySlug}-${index}.jpg`, size);
};


export const getListPreviewImage = (
  index: number,
  size: ImageSize = "thumbnail"
): string => {
  return getImageUrl(`lists/preview-${index}.jpg`, size);
};
