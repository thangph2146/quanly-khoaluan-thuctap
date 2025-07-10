/**
 * Deleted Lecturers Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { LecturerService } from '../services'
import type { Lecturer, LecturerFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useDeletedLecturers(filters: LecturerFilters) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchLecturers = useCallback(async (currentFilters: LecturerFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await LecturerService.getDeleted(currentFilters)

      if (response && typeof response === 'object' && 'data' in response) {
        setLecturers(response.data)
        setTotal(response.total)
      } else {
        console.error("Received unexpected data format for deleted lecturers:", response);
        setLecturers([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách giảng viên đã xóa')
      setLecturers([]); // Clear data on error
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLecturers({ ...filters, search: debouncedSearch })
  }, [fetchLecturers, filters.page, filters.limit, debouncedSearch])

  return {
    deletedLecturers: lecturers,
    total,
    isLoading,
    error,
    refetch: () => fetchLecturers({ ...filters, search: debouncedSearch }),
  }
} 