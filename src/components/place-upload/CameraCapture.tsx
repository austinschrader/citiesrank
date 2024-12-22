import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, FlipHorizontal, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onCapture(file);
          onClose();
        });
    }
  }, [webcamRef, onCapture, onClose]);

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="aspect-[4/3] relative bg-muted">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode,
            aspectRatio: 4/3,
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex justify-center gap-4">
        <Button variant="outline" size="icon" onClick={toggleCamera}>
          <FlipHorizontal className="h-4 w-4" />
        </Button>
        <Button onClick={capture} className="gap-2">
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
      </div>
    </Card>
  );
}
