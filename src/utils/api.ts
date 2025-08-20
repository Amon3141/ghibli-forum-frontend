import axios from 'axios';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    return process.env.BACKEND_URL || 'http://localhost:3001';
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
  withCredentials: true,
});