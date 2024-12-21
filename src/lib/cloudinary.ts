// src/lib/cloudinary.ts
import { Cloudinary } from "@cloudinary/url-gen";
import { improve } from "@cloudinary/url-gen/actions/adjust";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME) {
  throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not defined');
}

if (!UPLOAD_PRESET) {
  throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not defined');
}

const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUD_NAME,
  },
  url: {
    secure: true,
  },
});

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

export const uploadImage = async (file: File, publicId: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', `places/${publicId}`);
  formData.append('folder', 'places');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.public_id;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const getImageUrl = (path: string, size: ImageSize = "standard") => {
  const { width, height } = SIZES[size];

  return cld
    .image(path)
    .resize(thumbnail().width(width).height(height).gravity(autoGravity()))
    .adjust(improve())
    .toURL();
};

export const getPlaceImage = (
  citySlug: string,
  size: ImageSize = "standard"
): string => {
  return getImageUrl(`places/${citySlug}`, size);
};

export const getAttractionImage = (
  attractionSlug: string,
  size: ImageSize = "standard"
): string => {
  return getImageUrl(`attractions/${attractionSlug}`, size);
};
