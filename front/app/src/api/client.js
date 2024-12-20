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
  withCredentials: false,
});

// リクエストインターセプター
client.interceptors.request.use(
  (config) => {
    const authHeader = tokenManager.getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
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
      tokenManager.removeToken();
    }
    return Promise.reject(error);
  }
);

// 初期化時のトークン設定
const storedToken = tokenManager.getToken();
if (storedToken) {
  client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export default client;