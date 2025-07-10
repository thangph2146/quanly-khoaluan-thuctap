/**
 * Role Actions Hook
 * Custom hook for role CRUD operations with toast notifications
 */
import { useToast } from '@/components/ui/use-toast'
import { useCreateRole } from './use-create-role'
import { useUpdateRole } from './use-update-role'
import { useSoftDeleteRole } from './use-soft-delete-role'
import { useBulkRoleActions } from './use-bulk-actions'
import type { CreateRoleRequest, UpdateRoleRequest } from '../types'

/**
 * Hook for role actions with error handling and notifications
 */
export function useRoleActions(onSuccess?: () => void) {
  const { toast } = useToast()
  const { createRole, isCreating } = useCreateRole()
  const { updateRole, isUpdating } = useUpdateRole()
  const { softDeleteRole, isDeleting } = useSoftDeleteRole()
  const { executeBulkAction, isLoading: isBulkActionLoading } = useBulkRoleActions(onSuccess);

  const handleCreateRole = async (data: CreateRoleRequest) => {
    try {
      await createRole(data)
      toast({
        title: 'Thành công',
        description: 'Vai trò đã được tạo thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo vai trò.',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleUpdateRole = async (id: number, data: UpdateRoleRequest) => {
    try {
      await updateRole(id, data)
      toast({
        title: 'Thành công',
        description: 'Vai trò đã được cập nhật thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật vai trò.',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleSoftDeleteRole = async (id: number) => {
    try {
      await softDeleteRole(id)
      toast({
        title: 'Thành công',
        description: 'Vai trò đã được xóa tạm thời.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vai trò.',
        variant: 'destructive',
      })
      return false
    }
  }

  return {
    createRole: handleCreateRole,
    updateRole: handleUpdateRole,
    softDeleteRole: handleSoftDeleteRole,
    bulkAction: executeBulkAction,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkActionLoading,
  }
}
