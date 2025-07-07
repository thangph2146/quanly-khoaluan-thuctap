/**
 * Students Hook
 */
import { useState, useEffect } from 'react'
import { StudentService } from '../services/student.service'
import type { Student } from '../types'

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await StudentService.getAll()
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách sinh viên')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  return {
    students,
    isLoading,
    error,
    refetch: fetchStudents,
  }
}
