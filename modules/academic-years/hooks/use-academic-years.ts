/**
 * Academic Years Hook
 * Custom hook for academic years management
 */
import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { AcademicYearService } from '../services'
import type { AcademicYearFilters, PaginatedAcademicYears } from '../types'

export function useAcademicYears(filters: AcademicYearFilters) {
  const [data, setData] = useState<PaginatedAcademicYears>({ data: [], total: 0, page: 1, limit: 10 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchYears = useCallback(async (currentFilters: AcademicYearFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await AcademicYearService.getAll(currentFilters)
      setData(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchYears({ ...filters, search: debouncedSearch })
  }, [filters.page, filters.limit, debouncedSearch, filters.startDate, filters.endDate, fetchYears])

  return { ...data, isLoading, error, refetch: () => fetchYears({ ...filters, search: debouncedSearch }) }
}
