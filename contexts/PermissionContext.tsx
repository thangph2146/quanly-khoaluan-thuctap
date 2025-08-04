'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { permissionsAPI } from '@/lib/api/permissions.api'
import type { UserPermissions, ModulePermissions, ModuleDefinition, PermissionAction, PermissionCheckOptions } from '@/types/permissions'

interface PermissionContextType {
  permissions: UserPermissions
  modules: ModuleDefinition[]
  isLoading: boolean
  error: string | null
  
  // Permission check functions
  canPerform: (module: string, action: PermissionAction) => boolean
  canCreate: (module: string) => boolean
  canRead: (module: string) => boolean
  canUpdate: (module: string) => boolean
  canDelete: (module: string) => boolean
  canExport: (module: string) => boolean
  canApprove: (module: string) => boolean
  canAssign: (module: string) => boolean
  canManageRoles: (module: string) => boolean
  
  // Utility functions
  hasAnyPermission: (module: string) => boolean
  getModulePermissions: (module: string) => ModulePermissions | null
  refreshPermissions: () => Promise<void>
  
  // Module information
  getModule: (moduleName: string) => ModuleDefinition | undefined
  getModulesByCategory: (category: string) => ModuleDefinition[]
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

interface PermissionProviderProps {
  children: ReactNode
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { data: session, status } = useSession()
  const [permissions, setPermissions] = useState<UserPermissions>({})
  const [modules, setModules] = useState<ModuleDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async () => {
    if (status !== 'authenticated' || !session?.accessToken) {
      setPermissions({})
      setModules([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch permissions and modules in parallel
      const [userPermissions, moduleDefinitions] = await Promise.all([
        permissionsAPI.getCurrentUserPermissions(),
        permissionsAPI.getModules()
      ])
      
      setPermissions(userPermissions)
      setModules(moduleDefinitions)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải permissions'
      setError(errorMessage)
      console.error('Error fetching permissions:', err)
      
      // Set empty state on error
      setPermissions({})
      setModules([])
    } finally {
      setIsLoading(false)
    }
  }, [status, session?.accessToken])

  const refreshPermissions = useCallback(async () => {
    try {
      // Clear cache on backend first
      await permissionsAPI.refreshPermissionsCache()
      // Then refetch
      await fetchPermissions()
    } catch (err) {
      console.error('Error refreshing permissions:', err)
      // Still refetch even if cache clear fails
      await fetchPermissions()
    }
  }, [fetchPermissions])

  // Permission check functions
  const canPerform = useCallback((module: string, action: PermissionAction): boolean => {
    const modulePerms = permissions[module]
    if (!modulePerms) return false

    switch (action) {
      case 'create':
        return modulePerms.canCreate
      case 'read':
        return modulePerms.canRead
      case 'update':
        return modulePerms.canUpdate
      case 'delete':
        return modulePerms.canDelete
      case 'export':
        return modulePerms.canExport || false
      case 'approve':
        return modulePerms.canApprove || false
      case 'assign':
        return modulePerms.canAssign || false
      case 'manageRoles':
        return modulePerms.canManageRoles || false
      default:
        return false
    }
  }, [permissions])

  const canCreate = useCallback((module: string) => canPerform(module, 'create'), [canPerform])
  const canRead = useCallback((module: string) => canPerform(module, 'read'), [canPerform])
  const canUpdate = useCallback((module: string) => canPerform(module, 'update'), [canPerform])
  const canDelete = useCallback((module: string) => canPerform(module, 'delete'), [canPerform])
  const canExport = useCallback((module: string) => canPerform(module, 'export'), [canPerform])
  const canApprove = useCallback((module: string) => canPerform(module, 'approve'), [canPerform])
  const canAssign = useCallback((module: string) => canPerform(module, 'assign'), [canPerform])
  const canManageRoles = useCallback((module: string) => canPerform(module, 'manageRoles'), [canPerform])

  const hasAnyPermission = useCallback((module: string): boolean => {
    const modulePerms = permissions[module]
    if (!modulePerms) return false
    
    return Object.values(modulePerms).some(perm => perm === true)
  }, [permissions])

  const getModulePermissions = useCallback((module: string) => {
    return permissions[module] || null
  }, [permissions])

  const getModule = useCallback((moduleName: string) => {
    return modules.find(m => m.name === moduleName)
  }, [modules])

  const getModulesByCategory = useCallback((category: string) => {
    return modules.filter(m => m.category === category)
  }, [modules])

  // Load permissions on mount and when session changes
  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  // Setup real-time permission updates
  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken) return

    // Subscribe to real-time updates if supported
    if (permissionsAPI.isRealTimeSupported()) {
      permissionsAPI.subscribeToPermissionUpdates(session.accessToken)
      
      // Listen for permission changes
      const unsubscribe = permissionsAPI.onPermissionChange((newPermissions) => {
        setPermissions(newPermissions)
      })

      return () => {
        unsubscribe()
        permissionsAPI.unsubscribeFromPermissionUpdates()
      }
    } else {
      // Fallback to polling if SSE not supported
      const interval = setInterval(() => {
        fetchPermissions()
      }, 2 * 60 * 1000) // 2 minutes

      return () => clearInterval(interval)
    }
  }, [status, session?.accessToken, fetchPermissions])

  const contextValue: PermissionContextType = {
    permissions,
    modules,
    isLoading,
    error,
    canPerform,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canExport,
    canApprove,
    canAssign,
    canManageRoles,
    hasAnyPermission,
    getModulePermissions,
    refreshPermissions,
    getModule,
    getModulesByCategory,
  }

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissions = () => {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }
  return context
}

// Convenience hook for checking single permission
export const usePermissionCheck = ({ module, action, showError = true }: PermissionCheckOptions) => {
  const { canPerform, isLoading, error } = usePermissions()
  
  const hasPermission = canPerform(module, action)
  
  useEffect(() => {
    if (showError && !isLoading && !hasPermission && !error) {
      console.warn(`Permission denied: ${action} on ${module}`)
    }
  }, [hasPermission, isLoading, error, action, module, showError])
  
  return {
    hasPermission,
    isLoading,
    error
  }
} 