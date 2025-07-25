import { useState, useEffect, useCallback } from 'react'
import { SemesterService } from '../services'
import type { Semester, SemesterFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useSemesters(filters: SemesterFilters) {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchSemesters = useCallback(async (currentFilters: SemesterFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await SemesterService.getAll(currentFilters)

      if (response && typeof response === 'object' && 'data' in response) {
        setSemesters(response.data)
        setTotal(response.total)
      } else {
        console.error("Received unexpected data format for semesters:", response);
        setSemesters([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách học kỳ')
      setSemesters([]);
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSemesters({ ...filters, search: debouncedSearch })
  }, [fetchSemesters, filters.page, filters.limit, debouncedSearch])

  return {
    semesters,
    setSemesters, // Keep for optimistic updates
    total,
    isLoading,
    error,
    refetch: () => fetchSemesters({ ...filters, search: debouncedSearch }),
  }
}
