/**
 * Business Actions Hook
 */
import { useState } from 'react';
import { BusinessService } from '../services/business.service';
import type { BusinessMutationData } from '../types';
import { useToast } from '@/components/ui/use-toast';

export function useBusinessActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const createBusiness = async (data: BusinessMutationData) => {
    try {
      setIsCreating(true);
      await BusinessService.create(data);
      toast({ title: 'Thành công', description: 'Tạo business mới thành công' });
      onSuccess?.();
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể tạo business mới', variant: 'destructive' });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateBusiness = async (id: number, data: BusinessMutationData) => {
    try {
      setIsUpdating(true);
      await BusinessService.update(id, data);
      toast({ title: 'Thành công', description: 'Cập nhật business thành công' });
      onSuccess?.();
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể cập nhật business', variant: 'destructive' });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteBusiness = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await BusinessService.delete(id);
      toast({ title: 'Thành công', description: 'Xóa business thành công' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa business', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const softDeleteBusinesses = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await BusinessService.bulkSoftDelete(ids);
      toast({ title: 'Thành công', description: 'Xóa tạm thời các business thành công.' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các business', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const restoreBusinesses = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true);
      await BusinessService.bulkRestore(ids);
      toast({ title: 'Thành công', description: 'Khôi phục các business thành công.' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể khôi phục các business', variant: 'destructive' });
      return false;
    } finally {
      setIsRestoring(false);
    }
  };

  const permanentDeleteBusinesses = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await BusinessService.bulkPermanentDelete(ids);
      toast({ title: 'Thành công', description: 'Xóa vĩnh viễn các business thành công.' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn các business', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    softDeleteBusinesses,
    restoreBusinesses,
    permanentDeleteBusinesses,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  };
}
