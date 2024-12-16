import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;
const NODE_ENV = process.env.NODE_ENV || "development";

// CORSの設定
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.VITE_API_URL);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

if (NODE_ENV === "production") {
  // 静的ファイルの提供
  app.use(express.static(path.join(__dirname, "dist")));

  // APIリクエストの処理
  app.use("/api", (req, res, next) => {
    if (!req.url.startsWith("/v1")) {
      next();
      return;
    }
    const apiUrl = `${process.env.VITE_API_URL}${req.url}`;
    res.redirect(apiUrl);
  });

  // その他のルートをindex.htmlに転送
  app.get("*", (req, res) => {
    if (!req.url.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("Development server running");
  });
}

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`API URL: ${process.env.VITE_API_URL}`);
});
