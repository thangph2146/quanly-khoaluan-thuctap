/**
 * Deleted Internships Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { InternshipService } from '../services/internship.service'
import type { Internship, InternshipFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useDeletedInternships(filters: InternshipFilters) {
  const [internships, setInternships] = useState<Internship[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchDeletedInternships = useCallback(async (currentFilters: InternshipFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await InternshipService.getDeleted(currentFilters)

      if (response && typeof response === 'object' && 'data' in response) {
        setInternships(response.data)
        setTotal(response.total)
      } else {
        console.error("Received unexpected data format for deleted internships:", response);
        setInternships([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách thực tập đã xóa')
      setInternships([]);
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeletedInternships({ ...filters, search: debouncedSearch })
  }, [fetchDeletedInternships, filters.page, filters.limit, debouncedSearch])

  return {
    deletedInternships: internships,
    setDeletedInternships: setInternships, // For optimistic updates
    total,
    isLoading,
    error,
    refetch: () => fetchDeletedInternships({ ...filters, search: debouncedSearch }),
  }
} 