/**
 * Permission Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { PermissionService } from '../services/permission.service'
import type { PermissionMutationData } from '../types'

export function usePermissionActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createPermission = async (data: PermissionMutationData) => {
    try {
      setIsCreating(true)
      await PermissionService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo quyền mới thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo quyền mới',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updatePermission = async (id: number, data: PermissionMutationData) => {
    try {
      setIsUpdating(true)
      await PermissionService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật quyền thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật quyền',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deletePermission = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await PermissionService.delete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa quyền thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa quyền',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const softDeletePermissions = async (ids: (number|string)[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await PermissionService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các quyền thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các quyền',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const restorePermissions = async (ids: (number|string)[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await PermissionService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: 'Khôi phục quyền thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục quyền',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeletePermissions = async (ids: (number|string)[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await PermissionService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn quyền thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn quyền',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createPermission,
    updatePermission,
    deletePermission,
    softDeletePermissions,
    restorePermissions,
    permanentDeletePermissions,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
} 