import axios from "axios";
import { tokenManager } from "../utils/tokenManager";

// APIのベースURL取得
const getApiUrl = () => {
  // 本番環境のURLを明示的に設定
  if (import.meta.env.PROD) {
    return "https://osakana-calendar-api-7fca63533648.herokuapp.com";
  }
  // 開発環境のURL
  return "http://localhost:3000";
};

// axiosインスタンスの作成
const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // 認証が必要なエンドポイントのみにwitchCredentialsを設定
  withCredentials: true,
});

// テスト環境とそれ以外で異なる設定を適用
if (process.env.NODE_ENV === "test") {
  client.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer test-token";
    return config;
  });
} else {
  // 通常の環境用インターセプター
  client.interceptors.request.use(
    (config) => {
      const authHeader = tokenManager.getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => {
      const token = response.data?.token;
      if (token) {
        tokenManager.setToken(token);
      }
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        if (!window.isRedirecting) {
          window.isRedirecting = true;
          tokenManager.clearAll();
          delete client.defaults.headers.common["Authorization"];
          setTimeout(() => {
            window.isRedirecting = false;
            window.location.href = "/";
          }, 100);
        }
      }
      return Promise.reject(error);
    }
  );
}

// 初期トークン設定（テスト環境以外）
if (process.env.NODE_ENV !== "test") {
  const storedToken = tokenManager.getToken();
  if (storedToken) {
    client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
}

// デバッグログを追加するインターセプター
client.interceptors.request.use(
  (config) => {
    console.log("Request Config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// APIリクエストのデバッグ
client.interceptors.request.use((config) => {
  console.group("API Request Debug");
  console.log("URL:", config.url);
  console.log("Token from tokenManager:", tokenManager.getToken());
  console.log("Auth Header from tokenManager:", tokenManager.getAuthHeader());
  console.log("Final headers:", config.headers);
  console.groupEnd();
  return config;
});

// レスポンスのデバッグ
client.interceptors.response.use(
  (response) => {
    console.group("API Response Debug");
    console.log("URL:", response.config.url);
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data:", response.data);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group("API Error Debug");
    console.log("URL:", error.config?.url);
    console.log("Status:", error.response?.status);
    console.log("Error Data:", error.response?.data);
    console.log("Error Headers:", error.response?.headers);
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default client;
