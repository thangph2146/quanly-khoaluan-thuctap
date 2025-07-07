/**
 * Delete Role Hook
 * Custom hook for deleting roles
 */
import { useState } from 'react'
import { RoleService } from '../services'

/**
 * Hook for deleting roles
 */
export function useDeleteRole() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteRole = async (id: number) => {
    try {
      setIsDeleting(true)
      setError(null)
      await RoleService.remove(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteRole,
    isDeleting,
    error,
  }
}
