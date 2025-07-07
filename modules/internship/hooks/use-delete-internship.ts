/**
 * Delete Internship Hook
 * Custom hook for deleting internships
 */
import { useState } from 'react'
import { InternshipService } from '../services'

/**
 * Hook for deleting internships
 */
export function useDeleteInternship() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteInternship = async (id: number) => {
    try {
      setIsDeleting(true)
      setError(null)
      await InternshipService.remove(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteInternship,
    isDeleting,
    error,
  }
}
