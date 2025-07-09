/**
 * Deleted Departments Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { DepartmentService } from '../services/department.service'
import type { Department, DepartmentFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useDeletedDepartments(initialFilters: DepartmentFilters) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<DepartmentFilters>(initialFilters)

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchDepartments = useCallback(async (currentFilters: DepartmentFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await DepartmentService.getDeleted(currentFilters)

      // Handle both paginated and non-paginated API responses
      if (Array.isArray(response)) {
        // Legacy/current behavior: API returns a simple array
        console.warn("API response for deleted departments is not paginated. Falling back to client-side pagination.");
        setDepartments(response)
        setTotal(response.length)
      } else if (response && typeof response === 'object' && 'data' in response) {
        // Expected behavior: API returns a paginated object
        setDepartments(response.data)
        setTotal(response.total)
      } else {
        // Handle unexpected format
        console.error("Received unexpected data format for deleted departments:", response);
        setDepartments([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách đơn vị đã xóa')
      setDepartments([]); // Clear data on error
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartments({ ...filters, search: debouncedSearch })
  }, [fetchDepartments, filters.page, filters.limit, debouncedSearch])

  return {
    deletedDepartments: departments,
    setDeletedDepartments: setDepartments, // Keep for optimistic updates
    total,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: () => fetchDepartments(filters),
  }
} 