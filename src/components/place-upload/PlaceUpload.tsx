import { Button, Button as MapButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCitiesActions } from "@/features/places/context/CitiesContext";
import { uploadPlace } from "@/features/places/utils/placeUpload";
import { useToast } from "@/hooks/use-toast";
import { CitiesRecord, CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import exifr from "exifr";
import { Camera, Crosshair, ImageIcon, MapPin, Search, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Map, { Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import { CameraCapture } from "./CameraCapture";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface ExifData {
  latitude?: number;
  longitude?: number;
  DateTimeOriginal?: string;
  Make?: string;
  Model?: string;
  LensModel?: string;
  ExposureTime?: number;
  FNumber?: number;
  ISO?: number;
  FocalLength?: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface PlaceUploadProps {
  onClose: () => void;
}

export function PlaceUpload({ onClose }: PlaceUploadProps) {
  const navigate = useNavigate();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [placeName, setPlaceName] = useState(
    `Christmas Lights House #${Math.floor(Math.random() * 9000) + 1000}`
  );
  const [description, setDescription] = useState(
    "A dazzling holiday spectacle! This house transforms into a winter wonderland with thousands of synchronized LED lights dancing to festive music. Features include animated light sculptures, a towering Christmas tree, and a magical walkthrough experience that delights visitors of all ages. A must-visit destination during the holiday season that brings joy and wonder to the community."
  );
  const [isLocating, setIsLocating] = useState(false);
  const { pb } = useAuth();
  const { toast } = useToast();
  const { refreshCities } = useCitiesActions();

  const [viewState, setViewState] = useState({
    longitude: -122.7023063,
    latitude: 45.5320858,
    zoom: 13,
  });

  // Get initial coordinates from the map's current center
  useEffect(() => {
    if (!coordinates) {
      setCoordinates({
        lat: viewState.latitude,
        lng: viewState.longitude,
      });
    }
  }, []);

  const resetForm = useCallback(() => {
    setFiles([]);
    setPreview("");
    setExifData(null);
    setCoordinates(null);
    setPlaceName(
      `Christmas Lights House #${Math.floor(Math.random() * 9000) + 1000}`
    );
    setDescription(
      "A dazzling holiday spectacle! This house transforms into a winter wonderland with thousands of synchronized LED lights dancing to festive music. Features include animated light sculptures, a towering Christmas tree, and a magical walkthrough experience that delights visitors of all ages. A must-visit destination during the holiday season that brings joy and wonder to the community."
    );
    toast({
      description: "Form has been reset",
      duration: 2000,
    });
  }, [toast]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const file = acceptedFiles[0];
      setFiles([file]);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      toast({
        title: "File Added",
        description: "Your photo has been added and is ready to upload.",
      });

      // Extract EXIF data from the file
      try {
        const data = await exifr.parse(file, {
          pick: [
            "latitude",
            "longitude",
            "DateTimeOriginal",
            "Make",
            "Model",
            "LensModel",
            "ExposureTime",
            "FNumber",
            "ISO",
            "FocalLength",
          ],
        });

        if (!data || Object.keys(data).length === 0) {
          toast({
            description:
              "No location data found in photo. Using current map location.",
            duration: 3000,
          });
          setExifData(null);
          // Use current map coordinates
          setCoordinates({
            lat: viewState.latitude,
            lng: viewState.longitude,
          });
          return;
        }

        setExifData({
          latitude: data?.latitude,
          longitude: data?.longitude,
          DateTimeOriginal: data?.DateTimeOriginal,
          Make: data?.Make,
          Model: data?.Model,
          LensModel: data?.LensModel,
          ExposureTime: data?.ExposureTime,
          FNumber: data?.FNumber,
          ISO: data?.ISO,
          FocalLength: data?.FocalLength,
        });

        if (data.latitude && data.longitude) {
          setCoordinates({ lat: data.latitude, lng: data.longitude });
          toast({
            title: "Location Found",
            description:
              "Photo location data has been detected and will be used.",
            duration: 3000,
          });
        } else {
          // Use current map coordinates if no GPS data in EXIF
          setCoordinates({
            lat: viewState.latitude,
            lng: viewState.longitude,
          });
          toast({
            description: "Using current map location.",
            duration: 3000,
          });
        }

        // Generate a new random number for the place name
        setPlaceName(
          `Christmas Lights House #${Math.floor(Math.random() * 9000) + 1000}`
        );
      } catch (error) {
        console.error("Error extracting EXIF data:", error);
        toast({
          description:
            "No location data found in photo. Using current map location.",
          duration: 3000,
        });
        // Use current map coordinates on error
        setCoordinates({
          lat: viewState.latitude,
          lng: viewState.longitude,
        });
      }

      // Cleanup function to revoke the preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    },
    [toast, viewState]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  const formatExposureTime = (time?: number) => {
    if (!time) return null;
    return time < 1 ? `1/${Math.round(1 / time)}` : `${time}`;
  };

  const handleMapClick = (event: { lngLat: { lat: number; lng: number } }) => {
    const { lat, lng } = event.lngLat;
    console.log("Map clicked at:", { lat, lng });
    setCoordinates({ lat, lng });
    toast({
      description: "Location updated",
      duration: 2000,
    });
  };

  const handleCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      toast({
        title: "Error",
        description: "Geolocation is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Got coordinates:", { latitude, longitude });
        setCoordinates({ lat: latitude, lng: longitude });
        setViewState({
          latitude,
          longitude,
          zoom: 15, // Zoom in closer when finding location
        });
        toast({
          description: "Using your current location",
          duration: 2000,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Could not get your location. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Request timed out.";
            break;
          default:
            errorMessage += "Please try again or select manually.";
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setCoordinates({ lat, lng });
        setViewState({
          latitude: lat,
          longitude: lng,
          zoom: 15,
        });
        toast({
          description: `Location set to ${data.features[0].place_name}`,
          duration: 2000,
        });
      } else {
        toast({
          title: "Not Found",
          description:
            "Could not find that location. Please try another search.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!coordinates) {
      toast({
        title: "Error",
        description: "Please set a location for this photo",
        variant: "destructive",
      });
      return;
    }

    if (!pb.authStore.model) {
      toast({
        title: "Error",
        description: "Authentication error - please try logging in again",
        variant: "destructive",
      });
      return;
    }

    if (!files.length) {
      toast({
        title: "Error",
        description: "Please select a file or take a photo",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    const placeData: Partial<CitiesRecord> = {
      name: placeName,
      country: "United States",
      description: description,
      type: CitiesTypeOptions.sight,
      cost: 5,
      interesting: 8,
      transit: 7,
      population: "Unknown",
      crowdLevel: 8,
      recommendedStay: 1,
      bestSeason: 4,
      accessibility: 9,
      costIndex: 1,
      safetyScore: 9,
      walkScore: 8,
      transitScore: 7,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      highlights: [
        "Beautiful Christmas lights display",
        "Synchronized music and lights",
        "Family-friendly holiday experience",
        "Interactive walkthrough experience",
        "Community favorite",
      ],
    };

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await uploadPlace(pb, placeData, files[0]);

      clearInterval(interval);
      setProgress(100);

      if (result.success && result.id) {
        toast({
          title: "Success",
          description: "Place uploaded successfully!",
        });

        // Refresh cities data
        await refreshCities();

        // Close the dialog
        onClose();

        // Navigate to the new place using type/slug format
        setTimeout(() => {
          navigate(`/places/${placeData.type || "sight"}/${result.slug}`);
        }, 500);
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload place",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <DialogClose ref={dialogCloseRef} className="hidden" />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Photo</Label>
          {!files.length && !preview ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <Card
                {...getRootProps()}
                className={`border-dashed cursor-pointer hover:border-primary/50 transition-colors ${
                  isDragActive && "border-primary/50 bg-primary/5"
                }`}
              >
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">
                      Drop photo here or click to upload
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Upload a high-quality photo of the place. The photo will
                      be publicly visible.
                    </p>
                  </div>
                </div>
              </Card>
              <Card
                className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setShowCamera(true)}
              >
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Take a photo with camera</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Use your device's camera to take a photo of the place
                      right now.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : showCamera ? (
            <CameraCapture
              onCapture={(file) => {
                setFiles([file]);
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
                setShowCamera(false);
              }}
              onClose={() => setShowCamera(false)}
            />
          ) : (
            <Card className="relative overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={() => {
                  setFiles([]);
                  setPreview("");
                  setExifData(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="aspect-[4/3] relative bg-muted">
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </Card>
          )}
        </div>
        {files.length > 0 && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Photo Details</h3>
              {exifData ? (
                <div className="text-sm text-gray-600 space-y-1">
                  {coordinates && (
                    <p>
                      📍 Location: {coordinates.lat.toFixed(6)},{" "}
                      {coordinates.lng.toFixed(6)}
                    </p>
                  )}
                  {exifData.DateTimeOriginal && (
                    <p>
                      📅 Taken:{" "}
                      {new Date(exifData.DateTimeOriginal).toLocaleString()}
                    </p>
                  )}
                  {(exifData.Make || exifData.Model) && (
                    <p>
                      📸 Camera:{" "}
                      {[exifData.Make, exifData.Model]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  )}
                  {exifData.LensModel && <p>🔭 Lens: {exifData.LensModel}</p>}
                  {(exifData.ExposureTime ||
                    exifData.FNumber ||
                    exifData.ISO ||
                    exifData.FocalLength) && (
                    <p>
                      ⚙️ Settings:{" "}
                      {[
                        exifData.ExposureTime &&
                          `${formatExposureTime(exifData.ExposureTime)}s`,
                        exifData.FNumber && `f/${exifData.FNumber}`,
                        exifData.ISO && `ISO ${exifData.ISO}`,
                        exifData.FocalLength && `${exifData.FocalLength}mm`,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No EXIF data found in this photo
                </p>
              )}
            </div>

            {/* Map for location selection */}
            {coordinates && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <div className="relative">
                  {/* Search bar */}
                  <div className="absolute top-2 left-2 right-2 z-10 flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="Search for a location..."
                        className="pr-8 bg-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch(e.currentTarget.value);
                          }
                        }}
                      />
                      <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                    <MapButton
                      size="icon"
                      variant="secondary"
                      onClick={handleCurrentLocation}
                      disabled={isLocating}
                      className="bg-white hover:bg-gray-100"
                      title="Use my location"
                    >
                      {isLocating ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Crosshair className="w-4 h-4" />
                      )}
                    </MapButton>
                  </div>

                  <div className="h-[300px]">
                    <Map
                      mapboxAccessToken={MAPBOX_TOKEN}
                      {...viewState}
                      onMove={(evt) => setViewState(evt.viewState)}
                      onClick={handleMapClick}
                      style={{ width: "100%", height: "100%" }}
                      mapStyle="mapbox://styles/mapbox/streets-v12"
                      collectResourceTiming={false}
                      trackResize={false}
                      cooperativeGestures={true}
                    >
                      <Marker
                        longitude={coordinates.lng}
                        latitude={coordinates.lat}
                      >
                        <MapPin className="w-6 h-6 text-red-500" />
                      </Marker>
                    </Map>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 p-2 rounded text-sm text-center">
                    Click anywhere on the map to update the location
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              <div>
                <Label htmlFor="placeName">Place Name</Label>
                <Input
                  id="placeName"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Enter place name"
                  className="font-medium"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this place"
                  className="font-medium"
                />
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-gray-500">
                  {progress < 100 ? "Uploading..." : "Processing..."}
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full transition-all hover:scale-[1.01]"
            >
              {uploading ? "Uploading..." : "Upload Place"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
