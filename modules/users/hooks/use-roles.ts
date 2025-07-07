/**
 * Roles Hooks
 * Custom hooks for role management
 */
import { useState, useEffect } from 'react'
import type { Role } from '../types'
import { RoleService } from '../services'

/**
 * Hook for managing roles data
 */
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await RoleService.getAll()
      setRoles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const refetch = () => {
    fetchRoles()
  }

  return {
    roles,
    isLoading,
    error,
    refetch,
  }
}
