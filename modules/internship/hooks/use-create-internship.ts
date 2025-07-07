/**
 * Create Internship Hook
 * Custom hook for creating internships
 */
import { useState } from 'react'
import { InternshipService } from '../services'
import { CreateInternshipData } from '../types'

/**
 * Hook for creating internships
 */
export function useCreateInternship() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createInternship = async (data: CreateInternshipData) => {
    try {
      setIsCreating(true)
      setError(null)
      await InternshipService.create(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createInternship,
    isCreating,
    error,
  }
}
