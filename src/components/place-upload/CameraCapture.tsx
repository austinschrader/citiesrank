import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, SwitchCamera, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

interface CameraCaptureProps {
  onCapture: (file: File, location?: { latitude: number; longitude: number }) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Got location:', position);
          setLocation(position);
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }

    async function checkCameraAccess() {
      try {
        console.log('Checking for available video devices...');
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available video devices:', videoDevices);

        setHasMultipleCameras(videoDevices.length > 1);

        if (videoDevices.length === 0) {
          setHasPermission(false);
          setError('No camera devices found. Please ensure your camera is connected and not in use by another application.');
          return;
        }

        // Default to environment (back) camera if available
        const hasBackCamera = videoDevices.some(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment')
        );
        setFacingMode(hasBackCamera ? 'environment' : 'user');

        console.log('Requesting camera access...');
        await navigator.mediaDevices.getUserMedia({ 
          video: {
            facingMode: hasBackCamera ? "environment" : "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        console.log('Camera access granted!');
        setHasPermission(true);
        setError(null);
      } catch (err) {
        console.error('Camera access error:', err);
        setHasPermission(false);
        if (err instanceof Error) {
          if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            setError('No camera found. Please ensure your camera is connected and not in use by another application.');
          } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('Camera access denied. Please allow camera access in your browser settings.');
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            setError('Camera is in use by another application. Please close other apps that might be using your camera.');
          } else {
            setError(`Camera error: ${err.message}`);
          }
        } else {
          setError('An unexpected error occurred while accessing the camera.');
        }
      }
    }

    checkCameraAccess();
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onCapture(file, location?.coords ? {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          } : undefined);
          onClose();
        });
    }
  }, [webcamRef, onCapture, onClose, location]);

  const toggleCamera = useCallback(async () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    try {
      // Stop all video tracks first
      const stream = webcamRef.current?.video?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());

      // Request new stream with new facing mode
      await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: newMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      setFacingMode(newMode);
    } catch (err) {
      console.error('Failed to switch camera:', err);
    }
  }, [facingMode]);

  if (hasPermission === null) {
    return (
      <Card className="fixed inset-x-0 top-1/2 -translate-y-1/2 mx-4 max-w-lg md:mx-auto">
        <div className="p-4 text-center">
          <p>Checking camera availability...</p>
        </div>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card className="fixed inset-x-0 top-1/2 -translate-y-1/2 mx-4 max-w-lg md:mx-auto">
        <div className="p-4 text-center">
          <h3 className="font-medium mb-2">Camera Access Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error || "Please allow camera access to take a photo."}
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed inset-x-0 top-1/2 -translate-y-1/2 mx-4 max-w-lg md:mx-auto">
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
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }}
          className="absolute inset-0 w-full h-full object-cover"
          mirrored={facingMode === "user"}
        />
        {hasMultipleCameras && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleCamera}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white shadow-lg"
          >
            <SwitchCamera className="h-4 w-4" />
            <span className="sr-only">Switch Camera</span>
          </Button>
        )}
      </div>
      <div className="p-4 flex justify-center gap-4">
        <Button onClick={capture} className="gap-2">
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
      </div>
    </Card>
  );
}
