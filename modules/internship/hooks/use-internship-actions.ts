/**
 * Internship Actions Hook
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { InternshipService } from '../services/internship.service'
import type { CreateInternshipData, UpdateInternshipData } from '../types'

export function useInternshipActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const { toast } = useToast()

  const createInternship = async (data: CreateInternshipData) => {
    try {
      setIsCreating(true)
      await InternshipService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo kỳ thực tập mới thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo kỳ thực tập mới',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsCreating(false)
    }
  }

  const updateInternship = async (id: number, data: UpdateInternshipData) => {
    try {
      setIsUpdating(true)
      await InternshipService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật kỳ thực tập thành công',
      })
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật kỳ thực tập',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteInternship = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await InternshipService.delete(id)
      toast({
        title: 'Thành công',
        description: 'Xóa kỳ thực tập thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa kỳ thực tập',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const softDeleteInternships = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await InternshipService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các kỳ thực tập thành công.',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các kỳ thực tập',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  const restoreInternships = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true)
      await InternshipService.bulkRestore(ids)
      toast({
        title: 'Thành công',
        description: 'Khôi phục kỳ thực tập thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục kỳ thực tập',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsRestoring(false)
    }
  }

  const permanentDeleteInternships = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true)
      await InternshipService.bulkPermanentDelete(ids)
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn kỳ thực tập thành công',
      })
      onSuccess?.()
      return true
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn kỳ thực tập',
        variant: 'destructive',
      })
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    createInternship,
    updateInternship,
    deleteInternship,
    softDeleteInternships,
    restoreInternships,
    permanentDeleteInternships,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  }
} 