import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '@/utils/api';

const httpInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always send cookies (for httpOnly JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for automatic refresh on 401
httpInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt token refresh
        await httpInstance.post('/auth/token/refresh/');
        // Retry original request
        return httpInstance(originalRequest);
      } catch (refreshError) {
        // On refresh failure, redirect to login or handle as needed
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default httpInstance;
