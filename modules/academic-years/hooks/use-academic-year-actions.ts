/**
 * Academic Year Actions Hook
 * Provides CRUD operations for academic years
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { AcademicYearService } from '../services'
import type { CreateAcademicYearData, UpdateAcademicYearData } from '../types'

export function useAcademicYearActions(onSuccess?: () => void) {
  const [isCreating, setCreating] = useState(false)
  const [isUpdating, setUpdating] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createAcademicYear = async (data: CreateAcademicYearData) => {
    try {
      setCreating(true)
      await AcademicYearService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo năm học mới thành công',
      })
      onSuccess?.()
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
      onSuccess?.()
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

  const softDeleteAcademicYear = async (id: number) => {
    try {
      setDeleting(true)
      await AcademicYearService.softDelete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa năm học thành công',
      })
      onSuccess?.()
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

  const softDeleteAcademicYears = async (ids: number[]): Promise<boolean> => {
    try {
      setDeleting(true)
      await AcademicYearService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các năm học thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các năm học',
        variant: 'destructive',
      })
      return false
    } finally {
      setDeleting(false)
    }
  }

  const restoreAcademicYears = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await AcademicYearService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: 'Khôi phục năm học thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục năm học',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeleteAcademicYears = async (ids: number[]): Promise<boolean> => {
    try {
      setDeleting(true)
      await AcademicYearService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn năm học thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn năm học',
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
    softDeleteAcademicYear,
    softDeleteAcademicYears,
    restoreAcademicYears,
    permanentDeleteAcademicYears,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
}
