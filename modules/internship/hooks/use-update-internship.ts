/**
 * Update Internship Hook
 * Custom hook for updating internships
 */
import { useState } from 'react'
import { InternshipService } from '../services'
import { UpdateInternshipData } from '../types'

/**
 * Hook for updating internships
 */
export function useUpdateInternship() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateInternship = async (id: number, data: UpdateInternshipData) => {
    try {
      setIsUpdating(true)
      setError(null)
      await InternshipService.update(id, data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateInternship,
    isUpdating,
    error,
  }
}
