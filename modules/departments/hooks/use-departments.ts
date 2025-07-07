/**
 * Departments Hook
 */
import { useState, useEffect } from 'react'
import { DepartmentService } from '../services/department.service'
import type { Department } from '../types'

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await DepartmentService.getAll()
      setDepartments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách đơn vị')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return {
    departments,
    isLoading,
    error,
    refetch: fetchDepartments,
  }
}
