import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { setupOGP } from "./utils/ogpUtils";

// DOMContentLoadedイベントでOGP設定を実行
document.addEventListener("DOMContentLoaded", setupOGP);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
