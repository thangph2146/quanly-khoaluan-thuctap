/**
 * Partner Actions Hook
 * Provides CRUD operations for partners
 */
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { PartnerService } from '../services'
import type { CreatePartnerData, UpdatePartnerData } from '../types'

export function usePartnerActions(refetch: () => void) {
  const [isCreating, setCreating] = useState(false)
  const [isUpdating, setUpdating] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const createPartner = async (data: CreatePartnerData) => {
    try {
      setCreating(true)
      await PartnerService.create(data)
      toast({
        title: 'Thành công',
        description: 'Tạo đối tác mới thành công',
      })
      refetch()
    } catch (error) {
      console.error('Error creating partner:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi tạo đối tác',
        variant: 'destructive',
      })
      throw error
    } finally {
      setCreating(false)
    }
  }

  const updatePartner = async (id: number, data: UpdatePartnerData) => {
    try {
      setUpdating(true)
      await PartnerService.update(id, data)
      toast({
        title: 'Thành công',
        description: 'Cập nhật đối tác thành công',
      })
      refetch()
    } catch (error) {
      console.error('Error updating partner:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật đối tác',
        variant: 'destructive',
      })
      throw error
    } finally {
      setUpdating(false)
    }
  }

  const deletePartner = async (id: number) => {
    try {
      setDeleting(true)
      await PartnerService.remove(id)
      toast({
        title: 'Thành công',
        description: 'Xóa đối tác thành công',
      })
      refetch()
      return true
    } catch (error) {
      console.error('Error deleting partner:', error)
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi xóa đối tác',
        variant: 'destructive',
      })
      return false
    } finally {
      setDeleting(false)
    }
  }

  return {
    createPartner,
    updatePartner,
    deletePartner,
    isCreating,
    isUpdating,
    isDeleting,
  }
}
