/**
 * Lecturer Actions Hook
 * Custom hook for lecturer CRUD operations with toast notifications
 */
import { useToast } from '@/components/ui/use-toast'
import { useCreateLecturer } from './use-create-lecturer'
import { useUpdateLecturer } from './use-update-lecturer'
import { useDeleteLecturer } from './use-delete-lecturer'
import type { CreateLecturerData, UpdateLecturerData } from '../services'

/**
 * Hook for lecturer actions with error handling and notifications
 */
export function useLecturerActions(onSuccess?: () => void) {
  const { toast } = useToast()
  const { createLecturer, isCreating } = useCreateLecturer()
  const { updateLecturer, isUpdating } = useUpdateLecturer()
  const { deleteLecturer, isDeleting } = useDeleteLecturer()

  const handleCreateLecturer = async (data: CreateLecturerData) => {
    try {
      await createLecturer(data)
      toast({
        title: 'Thành công',
        description: 'Giảng viên đã được tạo thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo giảng viên.',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleUpdateLecturer = async (id: number, data: UpdateLecturerData) => {
    try {
      await updateLecturer(id, data)
      toast({
        title: 'Thành công',
        description: 'Giảng viên đã được cập nhật thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật giảng viên.',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleDeleteLecturer = async (id: number) => {
    try {
      await deleteLecturer(id)
      toast({
        title: 'Thành công',
        description: 'Giảng viên đã được xóa thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa giảng viên.',
        variant: 'destructive',
      })
      return false
    }
  }

  return {
    createLecturer: handleCreateLecturer,
    updateLecturer: handleUpdateLecturer,
    deleteLecturer: handleDeleteLecturer,
    isCreating,
    isUpdating,
    isDeleting,
  }
}