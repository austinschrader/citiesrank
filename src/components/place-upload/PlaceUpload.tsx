import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { uploadPlace } from "@/features/places/utils/placeUpload";
import { useToast } from "@/hooks/use-toast";
import { CitiesRecord, CitiesTypeOptions } from "@/lib/types/pocketbase-types";
import exifr from "exifr";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

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

export function PlaceUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [placeName, setPlaceName] = useState(
    `Christmas Lights House #${Math.floor(Math.random() * 9000) + 1000}`
  );
  const [description, setDescription] = useState(
    "A dazzling holiday spectacle! This house transforms into a winter wonderland with thousands of synchronized LED lights dancing to festive music. Features include animated light sculptures, a towering Christmas tree, and a magical walkthrough experience that delights visitors of all ages. A must-visit destination during the holiday season that brings joy and wonder to the community."
  );
  const { pb } = useAuth();
  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setFiles([]);
    setPreview("");
    setExifData(null);
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
            description: "No EXIF data found in this photo.",
            duration: 3000,
          });
          setExifData(null);
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
          toast({
            title: "Location Found",
            description:
              "Photo location data has been detected and will be used.",
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
          description: "No EXIF data found in this photo.",
          duration: 3000,
        });
      }

      // Cleanup function to revoke the preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    },
    [toast]
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

  const handleUpload = async () => {
    if (!files.length) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
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
      latitude: exifData?.latitude || 0,
      longitude: exifData?.longitude || 0,
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

      if (result.success) {
        toast({
          title: "Success",
          description: "Place uploaded successfully!",
        });
        // Reset form after successful upload
        resetForm();
      } else {
        throw new Error(result.error);
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
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetForm}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Reset Form
          </Button>
        </div>

        {preview ? (
          <div className="relative group mb-4">
            <div className="aspect-[16/9] w-full relative overflow-hidden rounded-lg">
              <img
                src={preview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-contain bg-gray-100"
              />
              <div
                {...getRootProps()}
                className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
              >
                <p className="text-white font-medium">Click or drag to replace</p>
                <input {...getInputProps()} />
              </div>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-102"
                  : "border-gray-300 hover:border-primary hover:scale-[1.01]"
              }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="text-4xl text-gray-400">📷</div>
              {isDragActive ? (
                <p className="text-lg">Drop your photo here...</p>
              ) : (
                <p className="text-lg">
                  Drag & drop a photo here, or click to select
                </p>
              )}
              <p className="text-sm text-gray-500">Supports: JPG, PNG, WebP</p>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4 space-y-4 animate-fadeIn">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Photo Details</h3>
              {exifData ? (
                <div className="text-sm text-gray-600 space-y-1">
                  {exifData.latitude && exifData.longitude && (
                    <p>
                      📍 Location: {exifData.latitude.toFixed(6)},{" "}
                      {exifData.longitude.toFixed(6)}
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
      </Card>
    </div>
  );
}
