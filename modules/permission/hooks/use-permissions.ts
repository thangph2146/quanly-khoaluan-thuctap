/**
 * Permission Hooks
 * Custom hooks for permission management
 */
import { useState, useEffect, useMemo } from 'react'
import type { Permission, CreatePermissionData, UpdatePermissionData } from '../types'
import { PermissionService } from '../services'
import { filterPermissions, sortPermissionsByName, sortPermissionsByModule } from '../utils/formatting'

/**
 * Hook for managing permissions data
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [modules, setModules] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [permissionsData, modulesData] = await Promise.all([
        PermissionService.getAll(),
        PermissionService.getModules(),
      ])
      setPermissions(permissionsData)
      setModules(modulesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  const refetch = () => {
    fetchPermissions()
  }

  return {
    permissions,
    modules,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for filtering and sorting permissions
 */
export function usePermissionFilters(permissions: Permission[]) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'module'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredPermissions = useMemo(() => {
    let filtered = permissions

    // Apply search filter
    if (searchTerm) {
      filtered = filterPermissions(filtered, searchTerm)
    }

    // Apply module filter
    if (selectedModule && selectedModule !== 'all') {
      filtered = filtered.filter(permission => permission.module === selectedModule)
    }

    // Apply sorting
    if (sortBy === 'name') {
      filtered = sortPermissionsByName(filtered, sortOrder)
    } else if (sortBy === 'module') {
      filtered = sortPermissionsByModule(filtered, sortOrder)
    }

    return filtered
  }, [permissions, searchTerm, selectedModule, sortBy, sortOrder])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedModule('all')
    setSortBy('name')
    setSortOrder('asc')
  }

  return {
    searchTerm,
    selectedModule,
    sortBy,
    sortOrder,
    filteredPermissions,
    setSearchTerm,
    setSelectedModule,
    setSortBy,
    setSortOrder,
    resetFilters,
  }
}

/**
 * Hook for managing single permission operations
 */
export function usePermission(id?: number) {
  const [permission, setPermission] = useState<Permission | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPermission = async (permissionId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await PermissionService.getById(permissionId)
      setPermission(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchPermission(id)
    }
  }, [id])

  const refetch = () => {
    if (id) {
      fetchPermission(id)
    }
  }

  return {
    permission,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook for managing permission actions (create, update, delete)
 */
export function usePermissionActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const createPermission = async (data: CreatePermissionData) => {
    try {
      setIsCreating(true)
      await PermissionService.create(data)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating permission:', error)
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updatePermission = async (id: number, data: UpdatePermissionData) => {
    try {
      setIsUpdating(true)
      await PermissionService.update(id, data)
      onSuccess?.()
    } catch (error) {
      console.error('Error updating permission:', error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deletePermission = async (id: number) => {
    try {
      setIsDeleting(true)
      await PermissionService.remove(id)
      onSuccess?.()
      return true
    } catch (error) {
      console.error('Error deleting permission:', error)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createPermission,
    updatePermission,
    deletePermission,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
