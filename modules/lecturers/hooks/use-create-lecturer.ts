/**
 * Create Lecturer Hook
 * Custom hook for creating lecturers
 */
import { useState } from 'react'
import type { CreateLecturerData } from '../services'
import { LecturerService } from '../services'

/**
 * Hook for creating lecturers
 */
export function useCreateLecturer() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createLecturer = async (data: CreateLecturerData) => {
    try {
      setIsCreating(true)
      setError(null)
      await LecturerService.create(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createLecturer,
    isCreating,
    error,
  }
} 