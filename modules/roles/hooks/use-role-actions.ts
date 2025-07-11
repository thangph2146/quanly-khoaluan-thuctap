/**
 * Role Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { RoleService } from '../services/role.service'
import type { RoleMutationData } from '../types'

export function useRoleActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createRole = async (data: RoleMutationData) => {
    try {
      setIsCreating(true)
      await RoleService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo vai trò mới thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo vai trò mới',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateRole = async (id: number, data: RoleMutationData) => {
    try {
      setIsUpdating(true)
      await RoleService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật vai trò thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật vai trò',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteRole = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await RoleService.delete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa vai trò thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vai trò',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const softDeleteRoles = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await RoleService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các vai trò thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các vai trò',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const restoreRoles = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await RoleService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: 'Khôi phục vai trò thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục vai trò',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeleteRoles = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await RoleService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn vai trò thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn vai trò',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createRole,
    updateRole,
    deleteRole,
    softDeleteRoles,
    restoreRoles,
    permanentDeleteRoles,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
} 