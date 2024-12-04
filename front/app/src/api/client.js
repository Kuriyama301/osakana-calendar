import axios from "axios";

// APIのベースURL取得
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isDevelopment = import.meta.env.DEV;

  // 開発環境の場合のみwarningを表示
  if (!envUrl && isDevelopment) {
    console.warn(
      "開発環境: API URLが設定されていません。localhost:3000を使用します"
    );
    return "http://localhost:3000";
  }

  return envUrl;
};

// axiosインスタンスの作成
const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
  withCredentials: false,
});

export default client;
