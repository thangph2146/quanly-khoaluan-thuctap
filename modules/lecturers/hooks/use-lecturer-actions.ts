/**
 * Lecturer Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { LecturerService } from '../services'
import type { LecturerMutationData } from '../types'
import type { UpdateLecturerData } from '@/modules/lecturers/api/lecturers.api'

export function useLecturerActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createLecturer = async (data: LecturerMutationData) => {
    try {
      setIsCreating(true)
      await LecturerService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo giảng viên mới thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo giảng viên mới',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateLecturer = async (id: number, data: Partial<UpdateLecturerData>) => {
    try {
      setIsUpdating(true)
      await LecturerService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật giảng viên thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật giảng viên',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteLecturer = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await LecturerService.softDelete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa giảng viên thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa giảng viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const softDeleteLecturers = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await LecturerService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: `Đã xóa tạm thời ${ids.length} giảng viên.`,
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các giảng viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const restoreLecturers = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await LecturerService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: `Khôi phục ${ids.length} giảng viên thành công`,
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục giảng viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeleteLecturers = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await LecturerService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: `Xóa vĩnh viễn ${ids.length} giảng viên thành công`,
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn giảng viên',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createLecturer,
    updateLecturer,
    deleteLecturer,
    softDeleteLecturers,
    restoreLecturers,
    permanentDeleteLecturers,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
}