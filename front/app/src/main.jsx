import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import { setupOGP } from "./utils/ogpUtils";

const clientId =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_GOOGLE_CLIENT_ID
    : "970626181711-egumgs3fofda67de67e393b8ekt48pls.apps.googleusercontent.com";

console.group("OAuth Debug Information");
console.log("Current URL:", window.location.href);
console.log("Origin:", window.location.origin);
console.log("Client ID:", clientId);
console.log("Environment:", import.meta.env.MODE);
console.groupEnd();

document.addEventListener("DOMContentLoaded", setupOGP);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={clientId}
      onScriptLoadError={(error) =>
        console.error("Google Script load error:", error)
      }
      onScriptLoadSuccess={() =>
        console.log("Google Script loaded successfully")
      }
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
