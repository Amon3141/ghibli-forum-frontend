import axios from 'axios';

const getBaseURL = () => {
  if (typeof window === 'undefined') {
    // Server-side: use localhost
    const baseUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
    return `${baseUrl}/api`;
  }
  // Client-side: use relative URL
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
});