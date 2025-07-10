/**
 * Soft Delete Role Hook
 * Custom hook for soft deleting roles
 */
import { useState } from 'react'
import { RoleService } from '../services'

/**
 * Hook for soft deleting roles
 */
export function useSoftDeleteRole() {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const softDeleteRole = async (id: number) => {
    try {
      setIsDeleting(true)
      setError(null)
      await RoleService.softDelete(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    softDeleteRole,
    isDeleting,
    error,
  }
}
