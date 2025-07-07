/**
 * Delete User Hook
 * Custom hook for deleting users
 */
import { useState } from 'react'
import { UserService } from '../services'

/**
 * Hook for deleting users
 */
export function useDeleteUser() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteUser = async (id: number) => {
    try {
      setIsDeleting(true)
      setError(null)
      await UserService.remove(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteUser,
    isDeleting,
    error,
  }
}
