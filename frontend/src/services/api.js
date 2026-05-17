import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — never expose errors to console with sensitive data
api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || 'Unable to connect to server';
    return Promise.reject(new Error(message));
  }
);

export default api;
