import axios from 'axios';

// APIのベースURL取得
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isDevelopment = import.meta.env.DEV;
  
  if (envUrl) {
    return envUrl;
  }
  
  if (isDevelopment) {
    console.warn('開発環境: API URLが設定されていません。localhost:3000を使用します');
    return 'http://localhost:3000';
  }
  
  throw new Error('本番環境: VITE_API_URLが設定されていません');
};

// axiosインスタンスの作成
const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000,
  withCredentials: false
});

// リクエスト送信前の処理
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンス受信時の処理
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      // TODO: ログイン画面へのリダイレクト
    }
    return Promise.reject(error);
  }
);

export default client;