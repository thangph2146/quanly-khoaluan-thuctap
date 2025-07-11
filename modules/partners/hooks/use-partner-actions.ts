import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PartnerService } from '../services/partner.service';
import type { PartnerMutationData } from '../types';

export function usePartnerActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const createPartner = async (data: PartnerMutationData) => {
    try {
      setIsCreating(true);
      await PartnerService.create(data);
      toast({
        title: 'Thành công',
        description: 'Tạo đối tác mới thành công',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể tạo đối tác mới',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updatePartner = async (id: number, data: PartnerMutationData) => {
    try {
      setIsUpdating(true);
      await PartnerService.update(id, data);
      toast({
        title: 'Thành công',
        description: 'Cập nhật đối tác thành công',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể cập nhật đối tác',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deletePartner = async (id: number) => {
    try {
      setIsDeleting(true);
      await PartnerService.softDelete(id);
      toast({
        title: 'Thành công',
        description: 'Xóa đối tác thành công.',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa đối tác',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const softDeletePartners = async (ids: number[]) => {
    try {
      setIsDeleting(true);
      await PartnerService.bulkSoftDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa tạm thời các đối tác thành công.',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các đối tác',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const restorePartners = async (ids: number[]) => {
    try {
      setIsRestoring(true);
      await PartnerService.bulkRestore(ids);
      toast({
        title: 'Thành công',
        description: 'Khôi phục đối tác thành công',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể khôi phục đối tác',
        variant: 'destructive',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const permanentDeletePartners = async (ids: number[]) => {
    try {
      setIsDeleting(true);
      await PartnerService.bulkPermanentDelete(ids);
      toast({
        title: 'Thành công',
        description: 'Xóa vĩnh viễn đối tác thành công',
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn đối tác',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createPartner,
    updatePartner,
    deletePartner,
    softDeletePartners,
    restorePartners,
    permanentDeletePartners,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  };
} 