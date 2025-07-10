import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { SemesterService } from '../services'
import type { SemesterMutationData } from '../types'

export function useSemesterActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createSemester = async (data: SemesterMutationData) => {
    try {
      setIsCreating(true)
      await SemesterService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo học kỳ mới thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo học kỳ mới',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateSemester = async (id: number, data: SemesterMutationData) => {
    try {
      setIsUpdating(true)
      await SemesterService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật học kỳ thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật học kỳ',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteSemester = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await SemesterService.softDelete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa học kỳ thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa học kỳ',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const softDeleteSemesters = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await SemesterService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các học kỳ thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các học kỳ',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const restoreSemesters = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await SemesterService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: 'Khôi phục học kỳ thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục học kỳ',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeleteSemesters = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await SemesterService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn học kỳ thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn học kỳ',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createSemester,
    updateSemester,
    deleteSemester,
    softDeleteSemesters,
    restoreSemesters,
    permanentDeleteSemesters,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
}
