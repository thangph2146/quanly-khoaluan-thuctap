import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { 
  RoleModulePermissionService, 
  RolePermissionMatrixDto, 
  ModulePermissionDto,
  UpdateRolePermissionMatrixDto 
} from '../api/role-module-permissions.api'

export function useRoleMatrixPermissions(roleId: number | null) {
  const [matrix, setMatrix] = useState<RolePermissionMatrixDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch matrix permissions for selected role
  const fetchMatrix = useCallback(async (id: number) => {
    if (!id) return
    
    try {
      setIsLoading(true)
      setError(null)
      const data = await RoleModulePermissionService.getRolePermissionMatrix(id)
      setMatrix(data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Không thể tải permissions matrix'
      setError(errorMsg)
      toast({
        title: 'Lỗi',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Update permissions for a specific module
  const updateModulePermission = useCallback((
    moduleName: string, 
    permissionType: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete', 
    value: boolean
  ) => {
    if (!matrix) return

    const updatedModules = matrix.modules.map(module => 
      module.moduleName === moduleName 
        ? { ...module, [permissionType]: value }
        : module
    )

    setMatrix({
      ...matrix,
      modules: updatedModules
    })
  }, [matrix])

  // Save matrix to backend
  const saveMatrix = useCallback(async () => {
    if (!matrix) return

    try {
      setIsSaving(true)
      setError(null)

      const updateDto: UpdateRolePermissionMatrixDto = {
        roleId: matrix.roleId,
        modules: matrix.modules
      }

      await RoleModulePermissionService.updateRolePermissionMatrix(matrix.roleId, updateDto)
      
      toast({
        title: 'Thành công',
        description: `Đã cập nhật phân quyền cho vai trò ${matrix.roleName}`,
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Không thể lưu permissions matrix'
      setError(errorMsg)
      toast({
        title: 'Lỗi',
        description: errorMsg,
        variant: 'destructive',
      })
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [matrix, toast])

  // Reset permissions for a module
  const resetModulePermissions = useCallback((moduleName: string) => {
    if (!matrix) return

    const updatedModules = matrix.modules.map(module => 
      module.moduleName === moduleName 
        ? { 
            ...module, 
            canCreate: false,
            canRead: false,
            canUpdate: false,
            canDelete: false
          }
        : module
    )

    setMatrix({
      ...matrix,
      modules: updatedModules
    })
  }, [matrix])

  // Set all permissions for a module
  const setAllModulePermissions = useCallback((moduleName: string, value: boolean) => {
    if (!matrix) return

    const updatedModules = matrix.modules.map(module => 
      module.moduleName === moduleName 
        ? { 
            ...module, 
            canCreate: value,
            canRead: value,
            canUpdate: value,
            canDelete: value
          }
        : module
    )

    setMatrix({
      ...matrix,
      modules: updatedModules
    })
  }, [matrix])

  // Check if matrix has any changes (for enable/disable save button)
  const hasChanges = useCallback(() => {
    // This would require keeping track of original state
    // For now, we'll assume changes exist if matrix is loaded
    return matrix !== null
  }, [matrix])

  // Load matrix when roleId changes
  useEffect(() => {
    if (roleId) {
      fetchMatrix(roleId)
    } else {
      setMatrix(null)
      setError(null)
    }
  }, [roleId, fetchMatrix])

  return {
    matrix,
    isLoading,
    isSaving,
    error,
    updateModulePermission,
    saveMatrix,
    resetModulePermissions,
    setAllModulePermissions,
    hasChanges: hasChanges(),
    refetch: () => roleId && fetchMatrix(roleId)
  }
}

// Additional hook for getting available modules
export function useAvailableModules() {
  const [modules, setModules] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await RoleModulePermissionService.getAvailableModules()
        setModules(data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Không thể tải danh sách modules'
        setError(errorMsg)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModules()
  }, [])

  return { modules, isLoading, error }
} 