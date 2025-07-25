import axios from 'axios';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    // Server-side: use localhost
    return 'http://localhost:3000/api';
  }
  // Client-side: use relative URL
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
});