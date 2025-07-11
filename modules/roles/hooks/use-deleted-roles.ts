/**
 * Deleted Roles Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { RoleService } from '../services/role.service'
import type { Role, RoleFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useDeletedRoles(filters: RoleFilters) {
  const [roles, setRoles] = useState<Role[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchRoles = useCallback(async (currentFilters: RoleFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await RoleService.getDeleted(currentFilters)

      // The API now always returns paginated format
      if (response && typeof response === 'object' && 'data' in response) {
        setRoles(response.data)
        setTotal(response.total)
      } else {
        // Fallback for unexpected format
        console.error("Received unexpected data format for deleted roles:", response);
        setRoles([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách vai trò đã xóa')
      setRoles([]); // Clear data on error
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles({ ...filters, search: debouncedSearch })
  }, [fetchRoles, filters.page, filters.limit, debouncedSearch])

  return {
    deletedRoles: roles,
    setDeletedRoles: setRoles, // Keep for optimistic updates
    total,
    isLoading,
    error,
    refetch: () => fetchRoles({ ...filters, search: debouncedSearch }),
  }
} 