import { useState, useEffect, useCallback } from 'react';
import { RoleService } from '../services';
import type { Role, RoleFilters, PaginatedResponse } from '../types';

export function useDeletedRoles(filters: RoleFilters = { page: 1, limit: 10 }) {
  const [response, setResponse] = useState<PaginatedResponse<Role>>({
    data: [],
    total: 0,
    page: filters.page || 1,
    limit: filters.limit || 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeletedRoles = useCallback(async (currentFilters: RoleFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await RoleService.getDeleted(currentFilters);
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedRoles(filters);
  }, [filters, fetchDeletedRoles]);

  const refetch = () => {
    fetchDeletedRoles(filters);
  };

  return {
    roles: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: Math.ceil(response.total / response.limit),
    isLoading,
    error,
    refetch,
  };
} 