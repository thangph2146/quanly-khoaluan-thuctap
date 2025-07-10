/**
 * Deleted Students Hook
 */
import { useState, useEffect, useCallback } from 'react'
import { StudentService } from '../services/student.service'
import type { Student, StudentFilters } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useDeletedStudents(filters: StudentFilters) {
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const fetchStudents = useCallback(async (currentFilters: StudentFilters) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await StudentService.getDeleted(currentFilters)

      if (response && typeof response === 'object' && 'data' in response) {
        setStudents(response.data)
        setTotal(response.total)
      } else {
        console.error("Received unexpected data format for deleted students:", response);
        setStudents([]);
        setTotal(0);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách sinh viên đã xóa')
      setStudents([]); // Clear data on error
      setTotal(0);
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudents({ ...filters, search: debouncedSearch })
  }, [fetchStudents, filters.page, filters.limit, debouncedSearch])

  return {
    deletedStudents: students,
    setDeletedStudents: setStudents,
    total,
    isLoading,
    error,
    refetch: () => fetchStudents({ ...filters, search: debouncedSearch }),
  }
} 