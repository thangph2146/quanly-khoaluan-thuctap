/**
 * User Actions Hook
 * Custom hook for user CRUD operations with toast notifications
 */
import { useToast } from '@/components/ui/use-toast'
import { useCreateUser, useUpdateUser, useSoftDeleteUser, useBulkUserActions } from './'
import type { CreateUserData, UpdateUserData } from '../types'

/**
 * Hook for user actions with error handling and notifications
 */
export function useUserActions(onSuccess?: () => void) {
  const { toast } = useToast()
  const { createUser, isCreating } = useCreateUser()
  const { updateUser, isUpdating } = useUpdateUser()
  const { softDeleteUser, isDeleting } = useSoftDeleteUser()
  const { executeBulkAction, isLoading: isBulkActionLoading } = useBulkUserActions(onSuccess);


  const handleCreateUser = async (data: CreateUserData) => {
    try {
      await createUser(data)
      toast({
        title: 'Thành công',
        description: 'Người dùng đã được tạo thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo người dùng.',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleUpdateUser = async (id: number, data: UpdateUserData) => {
    try {
      await updateUser(id, data)
      toast({
        title: 'Thành công',
        description: 'Người dùng đã được cập nhật thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật người dùng.',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleSoftDeleteUser = async (id: number) => {
    try {
      await softDeleteUser(id)
      toast({
        title: 'Thành công',
        description: 'Người dùng đã được xóa tạm thời.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa người dùng.',
        variant: 'destructive',
      })
      return false
    }
  }

  return {
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    softDeleteUser: handleSoftDeleteUser,
    bulkAction: executeBulkAction,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkActionLoading,
  }
}
