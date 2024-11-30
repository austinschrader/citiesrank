import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import GoogleAnalytics from "./components/GoogleAnalytics.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleAnalytics />
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
