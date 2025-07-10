/**
 * Deleted Semesters Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { SemesterService } from '../services'
import type { Semester, SemesterFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useDeletedSemesters(filters: SemesterFilters) {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchDeletedSemesters = useCallback(async (currentFilters: SemesterFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await SemesterService.getDeleted(currentFilters)

      if (response && typeof response === 'object' && 'data' in response) {
        setSemesters(response.data)
        setTotal(response.total)
      } else {
        console.error("Received unexpected data format for deleted semesters:", response);
        setSemesters([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách học kỳ đã xóa')
      setSemesters([]);
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeletedSemesters({ ...filters, search: debouncedSearch })
  }, [fetchDeletedSemesters, filters.page, filters.limit, debouncedSearch])

  return {
    deletedSemesters: semesters,
    setDeletedSemesters: setSemesters,
    total,
    isLoading,
    error,
    refetch: () => fetchDeletedSemesters({ ...filters, search: debouncedSearch }),
  }
} 