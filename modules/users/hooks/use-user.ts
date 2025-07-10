/**
 * User Hooks
 * Custom hooks for user management
 */
import { useState, useEffect, useCallback } from 'react'
import type { User, UserFilters, PaginatedResponse } from '../types'
import { UserService } from '../services'

/**
 * Hook for managing users data
 */
export function useUsers(filters: UserFilters = { page: 1, limit: 10 }) {
  const [response, setResponse] = useState<PaginatedResponse<User>>({
    data: [],
    total: 0,
    page: filters.page || 1,
    limit: filters.limit || 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (currentFilters: UserFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await UserService.getAll(currentFilters);
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(filters);
  }, [filters, fetchUsers]);

  const refetch = () => {
    fetchUsers(filters);
  };
  
  return {
    users: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: Math.ceil(response.total / response.limit),
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for managing single user operations
 */
export function useUser(id?: number) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async (userId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await UserService.getById(userId)
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchUser(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchUser(id)
    }
  }

  return {
    user,
    isLoading,
    error,
    refetch,
  }
}
