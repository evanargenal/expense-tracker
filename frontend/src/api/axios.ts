import axios from 'axios';

const AUTH_API_URL = '/auth'; // Base API URL

const axiosInstance = axios.create({
  baseURL: '/api', // Change this to match your API's base URL
  withCredentials: true, // Include credentials like cookies with requests
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop by not retrying the refresh endpoint
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // If the error status is 401 or 403, attempt to refresh the token
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        // Try to refresh the token
        await axiosInstance.post(`${AUTH_API_URL}/refresh`);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
