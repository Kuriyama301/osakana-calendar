import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import { setupOGP } from "./utils/ogpUtils";

// main.jsx の冒頭部分に追加
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Environment:", {
  mode: import.meta.env.MODE,
  hasClientId: !!clientId,
});

// DOMContentLoadedイベントでOGP設定を実行
document.addEventListener("DOMContentLoaded", setupOGP);

console.log("OAuth Initialization:", {
  clientId,
  env: import.meta.env.MODE,
  allEnv: import.meta.env,
});

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
