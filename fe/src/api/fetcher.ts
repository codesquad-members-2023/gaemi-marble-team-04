import axios from 'axios';

const { DEV, VITE_API_URL, VITE_WS_URL } = import.meta.env;

export const BASE_URL = DEV ? '' : VITE_API_URL;
export const BASE_WS_URL = DEV ? 'ws://localhost:8080' : VITE_WS_URL;

export const fetcher = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

fetcher.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
