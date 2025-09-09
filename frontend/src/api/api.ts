import axios from 'axios';
import type { Transaction } from '../types';

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
      const err = error as { response?: { data?: { message?: string; error?: string } } };
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log(response)
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; error?: string } } };
      throw new Error(err.response?.data?.message || err.response?.data?.error || 'Login failed');
    }
  },
};

// Helper function to transform transaction object from backend format (_id) to frontend format (id)
const transformTransaction = (transaction: Record<string, unknown>): Transaction => {
  if (!transaction) return transaction as Transaction;
  const { _id, ...rest } = transaction;
  return {
    ...rest,
    id: (_id as string)?.toString() || (_id as string),
  } as Transaction;
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
      // Transform the transaction to have id instead of _id
      const transformedTransaction = transformTransaction(response.data);
      return { transaction: transformedTransaction };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to create transaction');
    }
  },

  list: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    dateRange?: [string, string];
  }) => {
    try {
      // Transform frontend params to backend expected format
      const queryParams: Record<string, string | number | undefined> = {
        page: params?.page,
        limit: params?.limit,
        category: params?.category,
        type: params?.type,
      };

      // Handle date range
      if (params?.dateRange && params.dateRange.length === 2) {
        queryParams.start = params.dateRange[0];
        queryParams.end = params.dateRange[1];
      }

      const response = await api.get('/transactions', { params: queryParams });
      // Transform backend response to match frontend types
      const backendData = response.data;
      const totalPages = Math.ceil((backendData.meta?.total || 0) / (backendData.meta?.limit || 10));
      // Transform each transaction to have id instead of _id
      const transformedData = backendData.data.map(transformTransaction);
      return {
        data: transformedData,
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
      // Transform the transaction to have id instead of _id
      const transformedTransaction = transformTransaction(response.data);
      return transformedTransaction;
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
      // Transform the transaction to have id instead of _id
      const transformedTransaction = transformTransaction(response.data);
      return { transaction: transformedTransaction };
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

  aggregations: async (params?: {
    start?: string;
    end?: string;
  }) => {
    try {
      const queryParams: Record<string, string | undefined> = {};
      if (params?.start) queryParams.start = params.start;
      if (params?.end) queryParams.end = params.end;

      const response = await api.get('/transactions/aggregations', { params: queryParams });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch aggregations');
    }
  },
};