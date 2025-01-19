import App from "@/App.tsx";
import GoogleAnalytics from "@/config/GoogleAnalytics";
import "@/lib/styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleAnalytics />
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
