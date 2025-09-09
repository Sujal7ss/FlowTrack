import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData: { email: string; password: string; name: string }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log(response)
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },
};

// Transactions API calls
export const transactionsAPI = {
  create: async (transactionData: {
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    date: string;
  }) => {
    try {
      const response = await api.post('/transactions', transactionData);
      // Adjusted to match backend controller response format
      return { data: response.data, meta: null };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to create transaction');
    }
  },

  list: async (params?: { page?: number; limit?: number; category?: string; type?: string }) => {
    try {
      const response = await api.get('/transactions', { params });
      // Transform backend response to match frontend types
      const backendData = response.data;
      const totalPages = Math.ceil((backendData.meta?.total || 0) / (backendData.meta?.limit || 10));
      return {
        data: backendData.data,
        pagination: {
          page: backendData.meta?.page || 1,
          limit: backendData.meta?.limit || 10,
          total: backendData.meta?.total || 0,
          totalPages: totalPages
        }
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch transactions');
    }
  },

  get: async (id: string) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch transaction');
    }
  },

  update: async (id: string | undefined, transactionData: Partial<{
    amount: number;
    description: string;
    category: string;
    type: 'income' | 'expense';
    date: string;
  }>) => {
    if (!id) {
      throw new Error('Transaction ID is undefined');
    }
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to update transaction');
    }
  },

  delete: async (id: string | undefined) => {
    if (!id) {
      throw new Error('Transaction ID is undefined');
    }
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to delete transaction');
    }
  },

  aggregations: async () => {
    try {
      const response = await api.get('/transactions/aggregations');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch aggregations');
    }
  },
};