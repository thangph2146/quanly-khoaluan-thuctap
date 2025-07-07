/**
 * Create Role Hook
 * Custom hook for creating roles
 */
import { useState } from 'react'
import type { CreateRoleRequest } from '../types'
import { RoleService } from '../services'

/**
 * Hook for creating roles
 */
export function useCreateRole() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRole = async (data: CreateRoleRequest) => {
    try {
      setIsCreating(true)
      setError(null)
      await RoleService.create(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createRole,
    isCreating,
    error,
  }
}
