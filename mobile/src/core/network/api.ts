import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Assuming local testing with android emulator uses 10.0.2.2 or localhost for iOS/web
// Replace with actual production URL when deploying.
export const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to inject access token
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for 401 refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { refreshToken, login, logout } = useAuthStore.getState();
      
      if (refreshToken) {
        try {
          // Attempt to refresh token
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          if (data.accessToken && data.refreshToken) {
            await login(data.accessToken, data.refreshToken);
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, log user out
          await logout();
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, log out
        await logout();
      }
    }
    
    return Promise.reject(error);
  }
);
