import { useState, useCallback } from 'react';
import type { ApiResponse } from '../types';
import { STATUS } from '../constants';
import { apiService } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: typeof STATUS[keyof typeof STATUS];
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiMethod: (...args: unknown[]) => Promise<ApiResponse<T>>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    status: STATUS.IDLE,
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        status: STATUS.LOADING,
      }));

      try {
        const response = await apiMethod(...args);
        
        if (response.success) {
          setState(prev => ({
            ...prev,
            data: response.data,
            loading: false,
            error: null,
            status: STATUS.SUCCESS,
          }));
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: response.message || 'Произошла ошибка',
            status: STATUS.ERROR,
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка',
          status: STATUS.ERROR,
        }));
      }
    },
    [apiMethod]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      status: STATUS.IDLE,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Специализированные хуки для разных типов запросов
export function useGet<T>(endpoint: string, initialData: T | null = null) {
  return useApi<T>(
    () => apiService.get<T>(endpoint),
    initialData
  );
}

export function usePost<T>(endpoint: string, initialData: T | null = null) {
  return useApi<T>(
    (data: unknown) => apiService.post<T>(endpoint, data),
    initialData
  );
}

export function usePut<T>(endpoint: string, initialData: T | null = null) {
  return useApi<T>(
    (data: unknown) => apiService.put<T>(endpoint, data),
    initialData
  );
}

export function useDelete<T>(endpoint: string, initialData: T | null = null) {
  return useApi<T>(
    () => apiService.delete<T>(endpoint),
    initialData
  );
}
