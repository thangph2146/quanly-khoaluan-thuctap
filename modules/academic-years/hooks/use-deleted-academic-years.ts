/**
 * Deleted Academic Years Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { AcademicYearService } from '../services'
import type { AcademicYear, AcademicYearFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useDeletedAcademicYears(filters: AcademicYearFilters) {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchDeletedAcademicYears = useCallback(async (currentFilters: AcademicYearFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await AcademicYearService.getDeleted(currentFilters)
      setAcademicYears(response.data)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách năm học đã xóa')
      setAcademicYears([]);
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeletedAcademicYears({ ...filters, search: debouncedSearch })
  }, [fetchDeletedAcademicYears, filters.page, filters.limit, debouncedSearch])

  return {
    deletedAcademicYears: academicYears,
    setDeletedAcademicYears: setAcademicYears,
    total,
    isLoading,
    error,
    refetch: () => fetchDeletedAcademicYears({ ...filters, search: debouncedSearch }),
  }
} 