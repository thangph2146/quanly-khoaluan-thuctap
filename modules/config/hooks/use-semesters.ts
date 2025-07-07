/**
 * Semesters Hook
 * Custom hook for semesters management
 */
import { useState, useEffect } from 'react'
import type { Semester } from '../types'
import { SemesterService } from '../services'

/**
 * Hook for managing semesters data
 */
export function useSemesters() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSemesters = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await SemesterService.getAll()
      setSemesters(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSemesters()
  }, [])

  const refetch = () => {
    fetchSemesters()
  }

  return {
    semesters,
    isLoading,
    error,
    refetch,
  }
}
