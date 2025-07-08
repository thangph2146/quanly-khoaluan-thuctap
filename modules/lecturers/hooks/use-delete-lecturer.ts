/**
 * Delete Lecturer Hook
 * Custom hook for deleting lecturers
 */
import { useState } from 'react'
import { LecturerService } from '../services'

/**
 * Hook for deleting lecturers
 */
export function useDeleteLecturer() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteLecturer = async (id: number) => {
    try {
      setIsDeleting(true)
      setError(null)
      await LecturerService.remove(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteLecturer,
    isDeleting,
    error,
  }
} 