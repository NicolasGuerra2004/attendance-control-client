import axios from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté iniciado y que VITE_API_URL sea correcto.';
    }

    const data = error.response.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      const message = (data as { message?: unknown }).message;
      const errorMessage = (data as { error?: unknown }).error;
      if (typeof message === 'string' && message.trim()) return message;
      if (typeof errorMessage === 'string' && errorMessage.trim()) return errorMessage;
    }
  }

  return fallback;
};

const apiBaseUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_session');
    }

    return Promise.reject(error);
  },
);