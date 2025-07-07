/**
 * Roles Hooks
 * Custom hooks for roles management
 */
import { useState, useEffect } from 'react'
import type { Role } from '../types'
import type { CreateRoleRequest, UpdateRoleRequest } from '../services'
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

/**
 * Hook for managing single role operations
 */
export function useRole(id?: number) {
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRole = async (roleId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await RoleService.getById(roleId)
      setRole(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchRole(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchRole(id)
    }
  }

  return {
    role,
    isLoading,
    error,
    refetch,
  }
}
