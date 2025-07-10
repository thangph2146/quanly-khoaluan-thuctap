/**
 * Permissions Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { PermissionService } from '../services/permission.service'
import type { Permission, PermissionFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function usePermissions(filters: PermissionFilters) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchPermissions = useCallback(async (currentFilters: PermissionFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await PermissionService.getAll(currentFilters)

      if (response && typeof response === 'object' && 'data' in response) {
        setPermissions(response.data)
        setTotal(response.total)
      } else {
        console.error("Received unexpected data format for permissions:", response);
        setPermissions([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách quyền')
      setPermissions([]); // Clear data on error
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions({ ...filters, search: debouncedSearch })
  }, [fetchPermissions, filters.page, filters.limit, debouncedSearch])

  return {
    permissions,
    setPermissions,
    total,
    isLoading,
    error,
    refetch: () => fetchPermissions({ ...filters, search: debouncedSearch }),
  }
} 