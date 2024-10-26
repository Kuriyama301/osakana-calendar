import axios from 'axios';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (!envUrl) {
    throw new Error('API URL is not configured');
  }
  
  return envUrl;
};

const client = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  withCredentials: false
});

export default client;