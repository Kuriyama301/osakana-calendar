import axios from "axios";

// APIのベースURL取得
const getApiUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL;
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

// レスポンスインターセプターの改善
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

// 起動時のトークン復元処理を改善
const storedToken = localStorage.getItem("jwt_token");
if (storedToken) {
  const bearerToken = `Bearer ${storedToken}`;
  client.defaults.headers.common["Authorization"] = bearerToken;
  console.log("Restored token on client initialization:", bearerToken);
}

export default client;
