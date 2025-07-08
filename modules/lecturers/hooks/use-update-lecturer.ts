/**
 * Update Lecturer Hook
 * Custom hook for updating lecturers
 */
import { useState } from 'react'
import type { UpdateLecturerData } from '../services'
import { LecturerService } from '../services'

/**
 * Hook for updating lecturers
 */
export function useUpdateLecturer() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateLecturer = async (id: number, data: UpdateLecturerData) => {
    try {
      setIsUpdating(true)
      setError(null)
      await LecturerService.update(id, data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateLecturer,
    isUpdating,
    error,
  }
} 