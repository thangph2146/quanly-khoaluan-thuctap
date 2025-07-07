/**
 * Academic Year Actions Hook
 * Provides CRUD operations for academic years
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { AcademicYearService } from '../services'
import type { CreateAcademicYearData, UpdateAcademicYearData } from '../types'

export function useAcademicYearActions(refetch: () => void) {
  const [isCreating, setCreating] = useState(false)
  const [isUpdating, setUpdating] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const createAcademicYear = async (data: CreateAcademicYearData) => {
    try {
      setCreating(true)
      await AcademicYearService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo năm học mới thành công',
      })
      refetch()
    } catch (error) {
      console.error('Error creating academic year:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi tạo năm học',
        variant: 'destructive',
      })
      throw error
    } finally {
      setCreating(false)
    }
  }

  const updateAcademicYear = async (id: number, data: UpdateAcademicYearData) => {
    try {
      setUpdating(true)
      await AcademicYearService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật năm học thành công',
      })
      refetch()
    } catch (error) {
      console.error('Error updating academic year:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật năm học',
        variant: 'destructive',
      })
      throw error
    } finally {
      setUpdating(false)
    }
  }

  const deleteAcademicYear = async (id: number) => {
    try {
      setDeleting(true)
      await AcademicYearService.remove(id)
      toast({
        title: 'Thành công',
        description: 'Xóa năm học thành công',
      })
      refetch()
      return true
    } catch (error) {
      console.error('Error deleting academic year:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi xóa năm học',
        variant: 'destructive',
      })
      return false
    } finally {
      setDeleting(false)
    }
  }

  return {
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
