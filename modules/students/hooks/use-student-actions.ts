/**
 * Student Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { StudentService } from '../services/student.service'
import type { StudentMutationData } from '../types'

export function useStudentActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createStudent = async (data: StudentMutationData) => {
    try {
      setIsCreating(true)
      await StudentService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo sinh viên mới thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo sinh viên mới',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateStudent = async (id: number, data: StudentMutationData) => {
    try {
      setIsUpdating(true)
      await StudentService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật sinh viên thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật sinh viên',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteStudent = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await StudentService.softDelete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa sinh viên thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa sinh viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const softDeleteStudents = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await StudentService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các sinh viên thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các sinh viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const restoreStudents = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await StudentService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: 'Khôi phục sinh viên thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục sinh viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeleteStudents = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await StudentService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn sinh viên thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn sinh viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createStudent,
    updateStudent,
    deleteStudent,
    softDeleteStudents,
    restoreStudents,
    permanentDeleteStudents,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
}
