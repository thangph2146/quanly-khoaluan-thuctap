/**
 * Update User Hook
 * Custom hook for updating users
 */
import { useState } from 'react'
import type { UpdateUserData } from '../services'
import { UserService } from '../services'

/**
 * Hook for updating users
 */
export function useUpdateUser() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUser = async (id: number, data: UpdateUserData) => {
    try {
      setIsUpdating(true)
      setError(null)
      await UserService.update(id, data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateUser,
    isUpdating,
    error,
  }
}
