/**
 * Departments Hook
 * Custom hook for managing departments data
 */
import { useState, useEffect } from 'react'
import { getAllDepartments, type Department } from '@/lib/api/departments.api'

/**
 * Hook for managing departments data (flat list for dropdown)
 */
export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllDepartments()
      setDepartments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải danh sách khoa/đơn vị')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const refetch = () => {
    fetchDepartments()
  }

  return {
    departments,
    isLoading,
    error,
    refetch,
  }
}
