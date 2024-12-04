import axios from "axios";

// APIのベースURL取得
const getApiUrl = () => {
  return (
    import.meta.env.VITE_API_URL ||
    "https://osakana-calendar-api-7fca63533648.herokuapp.com"
  );
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
