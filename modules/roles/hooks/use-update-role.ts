/**
 * Update Role Hook
 * Custom hook for updating roles
 */
import { useState } from 'react'
import type { UpdateRoleRequest, Role } from '../types'
import { RoleService } from '../services'

/**
 * Hook for updating roles
 */
export function useUpdateRole() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRole = async (id: number, data: UpdateRoleRequest): Promise<Role> => {
    try {
      setIsUpdating(true)
      setError(null)
      const updatedRole = await RoleService.update(id, data)
      return updatedRole
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateRole,
    isUpdating,
    error,
  }
}
