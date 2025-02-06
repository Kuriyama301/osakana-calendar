import axios from "axios";
import { tokenManager } from "../utils/tokenManager";

// アクティブなリクエストの管理
const activeRequests = new Set();

// APIのベースURL取得
const getApiUrl = () => {
  return import.meta.env.PROD
    ? "https://osakana-calendar-api-7fca63533648.herokuapp.com"
    : "http://localhost:3000";
};

// axiosインスタンスの作成
const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// リクエストのクリーンアップ
const cleanupRequest = (controller) => {
  if (activeRequests.has(controller)) {
    activeRequests.delete(controller);
  }
};

// 全てのアクティブなリクエストをキャンセル
export const cancelAllRequests = () => {
  activeRequests.forEach((controller) => {
    try {
      controller.abort();
    } catch (error) {
      console.warn("Error canceling request:", error);
    }
    cleanupRequest(controller);
  });
};

if (process.env.NODE_ENV === "test") {
  client.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer test-token";
    return config;
  });
} else {
  // リクエストインターセプター
  client.interceptors.request.use(
    (config) => {
      // AbortControllerの設定
      const controller = new AbortController();
      activeRequests.add(controller);
      config.signal = controller.signal;

      // クリーンアップ処理の設定
      config.signal.addEventListener("abort", () => cleanupRequest(controller));

      // 認証ヘッダーの設定
      const authHeader = tokenManager.getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }

      // デバッグログ（開発環境のみ）
      if (process.env.NODE_ENV === "development") {
        console.group("API Request");
        console.log("URL:", config.url);
        console.log("Method:", config.method);
        console.log("Headers:", config.headers);
        console.groupEnd();
      }

      return config;
    },
    (error) => {
      console.error("Request setup error:", error);
      return Promise.reject(error);
    }
  );

  // レスポンスインターセプター
  client.interceptors.response.use(
    (response) => {
      // リクエストのクリーンアップ
      if (response.config.signal?.controller) {
        cleanupRequest(response.config.signal.controller);
      }

      // トークンの処理
      const token = response.data?.token;
      if (token) {
        tokenManager.setToken(token);
      }

      // デバッグログ（開発環境のみ）
      if (process.env.NODE_ENV === "development") {
        console.group("API Response");
        console.log("URL:", response.config.url);
        console.log("Status:", response.status);
        console.log("Data:", response.data);
        console.groupEnd();
      }

      return response;
    },
    (error) => {
      // リクエストのクリーンアップ
      if (error.config?.signal?.controller) {
        cleanupRequest(error.config.signal.controller);
      }

      // キャンセルされたリクエストの処理
      if (error.name === "CanceledError") {
        return Promise.reject(error);
      }

      // 認証エラーの処理
      if (error.response?.status === 401) {
        // トークンが無効な場合のみイベントを発行
        if (
          !error.config._retry &&
          error.response.data?.error !== "Token missing"
        ) {
          window.dispatchEvent(
            new CustomEvent("auth:unauthorized", {
              detail: {
                url: error.config.url,
                status: error.response.status,
                message:
                  error.response.data?.message || "Authentication failed",
              },
            })
          );
        }
      }

      // デバッグログ（開発環境のみ）
      if (process.env.NODE_ENV === "development") {
        console.group("API Error");
        console.log("URL:", error.config?.url);
        console.log("Status:", error.response?.status);
        console.log("Error:", error.response?.data);
        console.groupEnd();
      }

      return Promise.reject(error);
    }
  );
}

// 初期トークン設定
if (process.env.NODE_ENV !== "test") {
  const storedToken = tokenManager.getToken();
  if (storedToken) {
    client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
}

export default client;
