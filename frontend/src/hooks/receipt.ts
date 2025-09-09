import { useState } from 'react';
import { message } from 'antd';
import { api } from '../api/api';
import type { TransactionRequest } from '../types';

/**
 * Hook for uploading and parsing receipt files.
 *
 * Sends the receipt file to the backend for processing and returns
 * the extracted transaction data.
 */
export const useUploadReceipt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload receipt';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutateAsync,
    isPending: loading,
    error,
  };
};

/**
 * Hook for confirming and creating a transaction from extracted receipt data.
 *
 * Takes the extracted transaction data and creates a new transaction.
 */
export const useConfirmReceipt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = async (transactionData: TransactionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/transactions', transactionData);
      message.success('Transaction created successfully!');
      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transaction';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutateAsync,
    isPending: loading,
    error,
  };
};
