/**
 * APIクライアントの設定と通信処理の管理
 * axiosインスタンスの作成、リクエスト/レスポンスの前処理、エラーハンドリング、
 * 認証トークンの管理を実行
 * バックエンドのApplicationControllerと連携しJWT認証を処理
 */

import axios from "axios";
import { tokenManager } from "../utils/tokenManager";

/**
 * 進行中のリクエストを管理するSetオブジェクト
 * リクエストのキャンセルやクリーンアップに使用
 */
const activeRequests = new Set();

/**
 * 環境に応じたAPIのベースURLを取得
 * 本番環境ではHeroku、開発環境ではlocalhostを使用
 */
const getApiUrl = () => {
  return import.meta.env.PROD
    ? "https://osakana-calendar-api-7fca63533648.herokuapp.com"
    : "http://localhost:3000";
};

/**
 * axiosインスタンスの作成と基本設定
 * ベースURL、ヘッダー、認証情報の設定
 */
const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/**
 * リクエストコントローラーのクリーンアップ
 * 完了したリクエストをactiveRequestsから削除
 */
const cleanupRequest = (controller) => {
  if (activeRequests.has(controller)) {
    activeRequests.delete(controller);
  }
};

/**
 * 全てのアクティブなリクエストをキャンセル
 * ページ遷移時やコンポーネントのアンマウント時に使用
 */
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

// テスト環境用の設定
if (process.env.NODE_ENV === "test") {
  client.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer test-token";
    return config;
  });
} else {
  /**
   * リクエストインターセプター
   * リクエスト送信前の前処理を実行
   * - アボートコントローラーの設定
   * - 認証ヘッダーの追加
   * - 開発環境用のログ出力
   */
  client.interceptors.request.use(
    (config) => {
      const controller = new AbortController();
      activeRequests.add(controller);
      config.signal = controller.signal;

      config.signal.addEventListener("abort", () => cleanupRequest(controller));

      // 認証ヘッダーの設定
      const authHeader = tokenManager.getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }

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

  /**
   * レスポンスインターセプター
   * レスポンス受信後の後処理を実行
   * - リクエストのクリーンアップ
   * - JWTトークンの保存
   * - 開発環境用のログ出力
   * - 認証エラーのハンドリング
   */
  client.interceptors.response.use(
    (response) => {
      if (response.config.signal?.controller) {
        cleanupRequest(response.config.signal.controller);
      }

      // レスポンスからJWTトークンを取得して保存
      const token = response.data?.token;
      if (token) {
        tokenManager.setToken(token);
      }

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
      if (error.config?.signal?.controller) {
        cleanupRequest(error.config.signal.controller);
      }

      // リクエストキャンセルのエラー処理
      if (error.name === "CanceledError") {
        return Promise.reject(error);
      }

      // 認証エラー（401）のハンドリング
      if (error.response?.status === 401) {
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

/**
 * 初期化時の認証トークン設定
 * ローカルストレージに保存されているトークンを
 * axiosのデフォルトヘッダーに設定
 */
if (process.env.NODE_ENV !== "test") {
  const storedToken = tokenManager.getToken();
  if (storedToken) {
    client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
}

export default client;
