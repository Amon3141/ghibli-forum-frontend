import axios from 'axios';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return process.env.BACKEND_URL || 'http://localhost:3001';
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);