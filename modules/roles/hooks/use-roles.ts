/**
 * Roles Hooks
 * Custom hooks for roles management
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Role, PaginatedResponse, RoleFilters } from '../types'
import { RoleService } from '../services'

/**
 * Hook for managing roles data
 */
export function useRoles(filters: RoleFilters = { page: 1, limit: 10 }) {
  const [response, setResponse] = useState<PaginatedResponse<Role>>({
    data: [],
    total: 0,
    page: filters.page || 1,
    limit: filters.limit || 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeRoles = useMemo(() => response.data, [response.data]);

  const fetchRoles = useCallback(async (currentFilters: RoleFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await RoleService.getAll(currentFilters);
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles(filters);
  }, [filters, fetchRoles]);

  const setActiveRoles = useCallback((roles: Role[]) => {
    setResponse(prev => ({ ...prev, data: roles }));
  }, []);


  const refetch = () => {
    fetchRoles(filters)
  }

  return {
    roles: activeRoles,
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: Math.ceil(response.total / response.limit),
    isLoading,
    error,
    refetch,
    setActiveRoles,
  }
}

/**
 * Hook for managing single role operations
 */
export function useRole(id?: number) {
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRole = async (roleId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await RoleService.getById(roleId)
      setRole(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchRole(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchRole(id)
    }
  }

  return {
    role,
    isLoading,
    error,
    refetch,
  }
}
