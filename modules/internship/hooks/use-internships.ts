/**
 * Internships Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { InternshipService } from '../services/internship.service'
import type { Internship, InternshipFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useInternships(filters: InternshipFilters) {
  const [internships, setInternships] = useState<Internship[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchInternships = useCallback(async (currentFilters: InternshipFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await InternshipService.getAll(currentFilters)

      if (response && typeof response === 'object' && 'data' in response) {
        setInternships(response.data)
        setTotal(response.total)
      } else {
        console.error("Received unexpected data format for internships:", response);
        setInternships([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách thực tập')
      setInternships([]);
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInternships({ ...filters, search: debouncedSearch })
  }, [fetchInternships, filters.page, filters.limit, debouncedSearch])

  return {
    internships,
    setInternships, // For optimistic updates
    total,
    isLoading,
    error,
    refetch: () => fetchInternships({ ...filters, search: debouncedSearch }),
  }
} 