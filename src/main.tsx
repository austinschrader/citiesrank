import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import GoogleAnalytics from "./lib/GoogleAnalytics.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleAnalytics />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
