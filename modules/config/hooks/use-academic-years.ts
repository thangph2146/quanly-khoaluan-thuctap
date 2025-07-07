/**
 * Academic Years Hook
 * Custom hook for academic years management
 */
import { useState, useEffect } from 'react'
import type { AcademicYear } from '../types'
import { AcademicYearService } from '../services'

/**
 * Hook for managing academic years data
 */
export function useAcademicYears() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAcademicYears = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await AcademicYearService.getAll()
      setAcademicYears(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAcademicYears()
  }, [])

  const refetch = () => {
    fetchAcademicYears()
  }

  return {
    academicYears,
    isLoading,
    error,
    refetch,
  }
}
