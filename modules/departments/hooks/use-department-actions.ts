/**
 * Department Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { DepartmentService } from '../services/department.service'
import type { DepartmentMutationData } from '../types'

export function useDepartmentActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createDepartment = async (data: DepartmentMutationData) => {
    try {
      setIsCreating(true)
      await DepartmentService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo đơn vị mới thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo đơn vị mới',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateDepartment = async (id: number, data: DepartmentMutationData) => {
    try {
      setIsUpdating(true)
      await DepartmentService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật đơn vị thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật đơn vị',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteDepartment = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await DepartmentService.delete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa đơn vị thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa đơn vị',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const softDeleteDepartments = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await DepartmentService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các đơn vị thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các đơn vị',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const restoreDepartments = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await DepartmentService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: 'Khôi phục đơn vị thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục đơn vị',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeleteDepartments = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await DepartmentService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn đơn vị thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn đơn vị',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    softDeleteDepartments,
    restoreDepartments,
    permanentDeleteDepartments,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
}
