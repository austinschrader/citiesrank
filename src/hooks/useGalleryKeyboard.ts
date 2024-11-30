import { useEffect } from "react";

export const useGalleryKeyboard = (
  isFullscreen: boolean,
  toggleFullscreen: () => void,
  navigate: (direction: number) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case "Escape":
            toggleFullscreen();
            break;
          case "ArrowLeft":
            navigate(-1);
            break;
          case "ArrowRight":
            navigate(1);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, navigate, toggleFullscreen]);
};
