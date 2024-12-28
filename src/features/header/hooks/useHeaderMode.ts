import { useHeader } from "../context/HeaderContext";
import { useEffect } from "react";
import { useLocation as useRouteLocation } from "react-router-dom";

export function useHeaderMode() {
  const { setMode } = useHeader();
  const location = useRouteLocation();

  useEffect(() => {
    // Update header mode based on current route
    if (location.pathname === "/" || location.pathname === "/explore") {
      setMode("discover");
    } else if (location.pathname.startsWith("/lists")) {
      setMode("lists");
    } else if (location.pathname === "/feed") {
      setMode("latest");
    } else if (location.pathname === "/profile") {
      setMode("profile");
    } else if (location.pathname === "/favorites") {
      setMode("favorites");
    }
  }, [location.pathname, setMode]);
}
