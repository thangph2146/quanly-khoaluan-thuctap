/**
 * Department Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { DepartmentService } from '../services/department.service'
import type { CreateDepartmentData, UpdateDepartmentData } from '../types'

export function useDepartmentActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const createDepartment = async (data: CreateDepartmentData) => {
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

  const updateDepartment = async (id: number, data: UpdateDepartmentData) => {
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

  return {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
