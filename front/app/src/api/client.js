import axios from "axios";

// APIのベースURL取得
const getApiUrl = () => {
  if (process.env.NODE_ENV === "production") {
    // 本番環境ではVITE_API_URLを使用
    return import.meta.env.VITE_API_URL;
  }
  // 開発環境ではローカルのAPIを使用
  return "http://localhost:3000";
};

// axiosインスタンスの作成
const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // CORS設定に合わせて変更
  withCredentials: false,
  timeout: 10000, // タイムアウトを10秒に設定
});

// デバッグ用にベースURLを確認
console.log("API Base URL:", getApiUrl());

// レスポンスインターセプター
client.interceptors.response.use(
  (response) => {
    // レスポンスデータをログ（開発環境のみ）
    if (process.env.NODE_ENV === "development") {
      console.log("API Response:", response.data);
    }

    // トークンの処理
    const token = response.data?.token;
    if (token) {
      // Bearer スキーマを追加
      const bearerToken = `Bearer ${token}`;
      client.defaults.headers.common["Authorization"] = bearerToken;
      localStorage.setItem("jwt_token", token);
    }
    return response;
  },
  (error) => {
    // エラーハンドリング
    if (error.response?.status === 401) {
      // 認証エラー時の処理
      localStorage.removeItem("jwt_token");
      delete client.defaults.headers.common["Authorization"];
    }

    // エラーの詳細をログ（開発環境のみ）
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    return Promise.reject(error);
  }
);

// リクエストインターセプター（新規追加）
client.interceptors.request.use(
  (config) => {
    // リクエストの詳細をログ（開発環境のみ）
    if (process.env.NODE_ENV === "development") {
      console.log("API Request:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 起動時のトークン復元処理
const storedToken = localStorage.getItem("jwt_token");
if (storedToken) {
  const bearerToken = `Bearer ${storedToken}`;
  client.defaults.headers.common["Authorization"] = bearerToken;
}

export default client;
