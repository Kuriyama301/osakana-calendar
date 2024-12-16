import axios from "axios";

// APIのベースURL取得
const getApiUrl = () => {
  // Viteの環境変数
  return import.meta.env.VITE_API_URL || "http://localhost:3000";
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

// 認証関連のインターセプター
client.interceptors.response.use(
  (response) => {
    // トークンの取得方法を修正
    const token = response.data?.token;
    if (token) {
      // Bearer スキーマを追加
      const bearerToken = `Bearer ${token}`;
      client.defaults.headers.common["Authorization"] = bearerToken;
      localStorage.setItem("jwt_token", token);
      console.log("Token stored in interceptor:", bearerToken);
    }
    return response;
  },
  (error) => {
    // エラーハンドリングを追加
    if (error.response?.status === 401) {
      // 認証エラー時の処理
      localStorage.removeItem("jwt_token");
      delete client.defaults.headers.common["Authorization"];
    }
    return Promise.reject(error);
  }
);

// トークン復元処理
const storedToken = localStorage.getItem("jwt_token");
if (storedToken) {
  client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export default client;
