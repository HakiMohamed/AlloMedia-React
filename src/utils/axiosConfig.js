import axios from 'axios';
import { toast } from 'react-toastify';
import { create } from 'zustand';

// Zustand store for global loading state
export const useLoadingStore = create((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

// Create axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000, // Set a reasonable timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().setIsLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setIsLoading(false);
    if (response.data && response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    useLoadingStore.getState().setIsLoading(false);
    handleErrorResponse(error);
    return Promise.reject(error);
  }
);

// Error handling function
const handleErrorResponse = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        toast.error(data.message || 'Bad Request');
        break;
      case 401:
        toast.error(data.message || 'Unauthorized');
        // Redirect to login page or refresh token
        break;
      case 403:
        toast.error(data.message || 'Forbidden');
        break;
      case 404:
        toast.error(data.message || 'Not Found');
        break;
      case 500:
        toast.error(data.message || 'Internal Server Error');
        break;
      default:
        toast.error(data.message || 'An error occurred');
    }
  } else if (error.request) {
    toast.error('No response received from server');
  } else {
    toast.error('Error in setting up the request');
  }
};

export default instance;