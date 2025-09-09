import { useState, useEffect } from "react";
import { transactionsAPI } from "../api/api";
import type { AggregationsResponse } from "../types";

// Aggregations hook
export const useAggregations = (dateRange?: [string, string]) => {
  const [data, setData] = useState<AggregationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch aggregations from the backend
      const aggregationsData = await transactionsAPI.aggregations();
      console.log('agg', aggregationsData)
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
