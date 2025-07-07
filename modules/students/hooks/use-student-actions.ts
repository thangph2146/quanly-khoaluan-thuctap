/**
 * Student Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { StudentService } from '../services/student.service'
import type { CreateStudentData, UpdateStudentData } from '../types'

export function useStudentActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const createStudent = async (data: CreateStudentData) => {
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

  const updateStudent = async (id: number, data: UpdateStudentData) => {
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
      await StudentService.delete(id)
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

  return {
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
