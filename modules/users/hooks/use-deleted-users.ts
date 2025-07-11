import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../services';
import type { User, UserFilters, PaginatedResponse } from '../types';

export function useDeletedUsers(filters: UserFilters = { page: 1, limit: 10 }) {
  const [response, setResponse] = useState<PaginatedResponse<User>>({
    data: [],
    total: 0,
    page: filters.page || 1,
    limit: filters.limit || 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeletedUsers = useCallback(async (currentFilters: UserFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await UserService.getDeleted(currentFilters);
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedUsers(filters);
  }, [filters, fetchDeletedUsers]);

  const refetch = () => {
    fetchDeletedUsers(filters);
  };

  return {
    users: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: Math.ceil(Math.max(0, response.total) / (response.limit || 10)),
    isLoading,
    error,
    refetch,
  };
} 