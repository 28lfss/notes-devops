import { useState, useCallback } from 'react';
import { ApiError } from '../api/client';

interface UseApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

interface UseApiCallReturn<T> extends UseApiCallState<T> {
  execute: (...args: unknown[]) => Promise<T | void>;
  reset: () => void;
}

export const useApiCall = <T>(
  apiFunction: (...args: unknown[]) => Promise<T>
): UseApiCallReturn<T> => {
  const [state, setState] = useState<UseApiCallState<T>>({
    data: null,
    loading: false,
    error: '',
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | void> => {
      setState((prev) => ({ ...prev, loading: true, error: '' }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: '' });
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof ApiError ? err.message : 'An unexpected error occurred';
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
        throw err;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: '' });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

