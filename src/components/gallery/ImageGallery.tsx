import { getPlaceImageByCityAndCountry } from "@/lib/bunny";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeString } from "@/features/admin/utils/placeValidation";

interface ImageSource {
  mobile: string;
  tablet: string;
  desktop: string;
  fullscreen: string;
}

interface ImageData {
  title: string;
  sources: ImageSource;
}

interface ImageGalleryProps {
  imageUrl: string;
  cityName: string;
  country: string;
  showControls?: boolean;
  onImageClick?: () => void;
  variant?: "default" | "hero";
  priority?: boolean;
}

export const ImageGallery = ({
  imageUrl,
  cityName,
  country,
  showControls = false,
  onImageClick,
  variant = "default",
  priority = false,
}: ImageGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [validImages, setValidImages] = useState<number[]>([]);

  type ImageArray = ImageData[];
  type ImageProxy = ImageArray & { [key: number]: ImageData };

  // Generate image URLs only once
  const images = useMemo<ImageProxy>(() => {
    const generateImage = (i: number): ImageData => ({
      title: `${cityName}, ${country} - Image ${i + 1}`,
      sources: {
        mobile: getPlaceImageByCityAndCountry(
          normalizeString(cityName),
          normalizeString(country),
          i + 1,
          "mobile"
        ),
        tablet: getPlaceImageByCityAndCountry(
          normalizeString(cityName),
          normalizeString(country),
          i + 1,
          "tablet"
        ),
        desktop: getPlaceImageByCityAndCountry(
          normalizeString(cityName),
          normalizeString(country),
          i + 1,
          "wide"
        ),
        fullscreen: getPlaceImageByCityAndCountry(
          normalizeString(cityName),
          normalizeString(country),
          i + 1,
          "fullscreen"
        ),
      },
    });

    return new Proxy([] as ImageArray, {
      get(target: ImageArray, prop: string | symbol): ImageData | any {
        const index = parseInt(prop as string);
        if (!isNaN(index)) {
          while (target.length <= index) {
            target.push(generateImage(target.length));
          }
        }
        return target[prop as keyof typeof target];
      },
    }) as ImageProxy;
  }, [cityName, country]);

  // Check which images exist
  useEffect(() => {
    const checkImage = async (index: number) => {
      const img = new Image();
      img.src = images[index].sources.tablet;

      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        return index;
      } catch {
        return null;
      }
    };

    // Check images in batches of 3, up to 9 images max
    const findValidImages = async () => {
      const validIndices: number[] = [];
      let consecutiveMisses = 0;

      for (let batch = 0; batch < 3 && consecutiveMisses < 2; batch++) {
        const batchIndices = [batch * 3, batch * 3 + 1, batch * 3 + 2];
        const results = await Promise.all(batchIndices.map(checkImage));

        const validBatchIndices = results.filter(
          (i): i is number => i !== null
        );
        if (validBatchIndices.length === 0) {
          consecutiveMisses++;
        } else {
          consecutiveMisses = 0;
          validIndices.push(...validBatchIndices);
        }
      }

      setValidImages(validIndices);
      setIsLoading(false);
    };

    findValidImages();
  }, [images]);

  const navigate = useCallback(
    (direction: number) => {
      const newIndex =
        (currentIndex + direction + validImages.length) % validImages.length;
      setCurrentIndex(newIndex);
    },
    [currentIndex, validImages.length]
  );

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Only show controls if we have more than one valid image
  const shouldShowControls = showControls && validImages.length > 1;
  const currentValidIndex = validImages[currentIndex % validImages.length] || 0;

  if (validImages.length === 0 && !isLoading) {
    return (
      <div className="relative w-full h-full min-h-[200px] bg-muted flex items-center justify-center">
        <ImagePlus className="w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[200px]">
      {isLoading && (
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer bg-[length:200%_100%]" />
        </div>
      )}

      {/* Hero overlay gradients */}
      {variant === "hero" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </>
      )}

      <picture className="w-full h-full" onClick={onImageClick}>
        <source
          media="(max-width: 640px)"
          srcSet={images[currentValidIndex].sources.mobile}
        />
        <source
          media="(max-width: 1024px)"
          srcSet={images[currentValidIndex].sources.tablet}
        />
        <source
          media="(min-width: 1025px)"
          srcSet={
            variant === "hero"
              ? images[currentValidIndex].sources.desktop
              : images[currentValidIndex].sources.tablet
          }
        />
        <img
          src={
            variant === "hero"
              ? images[currentValidIndex].sources.desktop
              : images[currentValidIndex].sources.tablet
          }
          alt={images[currentValidIndex].title}
          className={cn(
            "w-full h-full object-cover",
            onImageClick && "cursor-pointer"
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleImageLoad}
        />
      </picture>

      {/* Gallery controls */}
      {variant === "hero" && onImageClick && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImageClick();
            }}
            className={cn(
              "bg-white/90 hover:bg-white rounded-full transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white",
              variant === "hero" ? "p-2 sm:p-3" : "p-1.5 sm:p-2"
            )}
            aria-label="Open gallery"
          >
            <ImagePlus
              className={cn(
                "text-gray-800",
                variant === "hero" ? "h-4 w-4 sm:h-5 sm:w-5" : "h-4 w-4"
              )}
            />
          </button>
        </div>
      )}

      {images.length > 1 && (
        <div
          className={cn(
            "absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-4 transition-opacity duration-200",
            showControls ? "opacity-100" : "opacity-0",
            variant === "hero" && "z-10"
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className={cn(
              "bg-white/90 hover:bg-white rounded-full transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white",
              variant === "hero" ? "p-2 sm:p-3" : "p-1.5 sm:p-2"
            )}
            aria-label="Previous image"
          >
            <ChevronLeft
              className={cn(
                "text-gray-800",
                variant === "hero"
                  ? "h-5 w-5 sm:h-6 sm:w-6"
                  : "h-4 w-4 sm:h-5 sm:w-5"
              )}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            className={cn(
              "bg-white/90 hover:bg-white rounded-full transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white",
              variant === "hero" ? "p-2 sm:p-3" : "p-1.5 sm:p-2"
            )}
            aria-label="Next image"
          >
            <ChevronRight
              className={cn(
                "text-gray-800",
                variant === "hero"
                  ? "h-5 w-5 sm:h-6 sm:w-6"
                  : "h-4 w-4 sm:h-5 sm:w-5"
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
};
