import { useState, useEffect } from "react";
import { message } from 'antd';
import { transactionsAPI } from "../api/api";
import type {
  AggregationsResponse,
  TransactionFilters,
  TransactionsResponse,
  TransactionRequest,
  Transaction
} from "../types";

// Transaction hooks
export const useTransactions = (filters: TransactionFilters = {}) => {
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionsAPI.list(filters);
      setData(response);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch transactions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data when component mounts or filters change
  useEffect(() => {
    refetch();
  }, [JSON.stringify(filters)]);

  return {
    data,
    isLoading: loading,
    error,
    refetch,
  };
};

export const useCreateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: TransactionRequest): Promise<Transaction> => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionsAPI.create(data);
      message.success("Transaction created successfully!");
      return response.transaction;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create transaction";
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isPending: loading,
    error,
  };
};

export const useUpdateTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async ({
    id,
    data,
  }: {
    id: string | undefined;
    data: Partial<TransactionRequest>;
  }): Promise<Transaction> => {
    if (!id) {
      const errorMessage = "Transaction ID is undefined";
      setError(errorMessage);
      message.error(errorMessage);
      throw new Error(errorMessage);
    }
    setLoading(true);
    setError(null);
    try {
      const response = await transactionsAPI.update(id, data);
      message.success("Transaction updated successfully!");
      return response.transaction;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update transaction";
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isPending: loading,
    error,
  };
};

export const useDeleteTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await transactionsAPI.delete(id);
      message.success("Transaction deleted successfully!");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete transaction";
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isPending: loading,
    error,
  };
};

// Aggregations hook
export const useAggregations = (dateRange?: [string, string]) => {
  const [data, setData] = useState<AggregationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch aggregations from the backend with date range filtering
      const params = dateRange && dateRange.length === 2 ? {
        start: dateRange[0],
        end: dateRange[1]
      } : undefined;
      const aggregationsData = await transactionsAPI.aggregations(params);
      setData(aggregationsData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch aggregations";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data when component mounts or dateRange changes
  useEffect(() => {
    refetch();
  }, [dateRange]);

  return {
    data,
    isLoading: loading,
    error,
    refetch,
  };
};
