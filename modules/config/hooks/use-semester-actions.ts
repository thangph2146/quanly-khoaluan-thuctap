/**
 * Semester Actions Hook
 * Provides CRUD operations for semesters
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { SemesterService } from '../services'
import type { CreateSemesterData, UpdateSemesterData } from '../types'

export function useSemesterActions(refetch: () => void) {
  const [isCreating, setCreating] = useState(false)
  const [isUpdating, setUpdating] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const createSemester = async (data: CreateSemesterData) => {
    try {
      setCreating(true)
      await SemesterService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo học kỳ mới thành công',
      })
      refetch()
    } catch (error) {
      console.error('Error creating semester:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi tạo học kỳ',
        variant: 'destructive',
      })
      throw error
    } finally {
      setCreating(false)
    }
  }

  const updateSemester = async (id: number, data: UpdateSemesterData) => {
    try {
      setUpdating(true)
      await SemesterService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật học kỳ thành công',
      })
      refetch()
    } catch (error) {
      console.error('Error updating semester:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật học kỳ',
        variant: 'destructive',
      })
      throw error
    } finally {
      setUpdating(false)
    }
  }

  const deleteSemester = async (id: number) => {
    try {
      setDeleting(true)
      await SemesterService.remove(id)
      toast({
        title: 'Thành công',
        description: 'Xóa học kỳ thành công',
      })
      refetch()
      return true
    } catch (error) {
      console.error('Error deleting semester:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi xóa học kỳ',
        variant: 'destructive',
      })
      return false
    } finally {
      setDeleting(false)
    }
  }

  return {
    createSemester,
    updateSemester,
    deleteSemester,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
