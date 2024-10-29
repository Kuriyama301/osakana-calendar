import axios from 'axios';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isDevelopment = import.meta.env.DEV;
  
  // 開発環境のフォールバック
  if (!envUrl && isDevelopment) {
    return 'http://localhost:3000';
  }
  
  if (!envUrl) {
    console.warn('API URL not configured, using production URL');
    return 'https://osakana-calendar-api-7fca63533648.herokuapp.com';
  }
  
  return envUrl;
};

const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000,
  withCredentials: false
});

export default client;