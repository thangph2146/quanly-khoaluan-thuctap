import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ThesisPeriodService } from '../services/thesis-period.service';
import type { ThesisPeriodMutationData } from '../types';

export function useThesisPeriodActions(onSuccess?: () => void) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const createThesisPeriod = async (data: ThesisPeriodMutationData) => {
    try {
      setIsCreating(true);
      await ThesisPeriodService.create(data);
      toast({ title: 'Thành công', description: 'Tạo đợt khóa luận mới thành công' });
      onSuccess?.();
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể tạo đợt khóa luận mới', variant: 'destructive' });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateThesisPeriod = async (id: number, data: ThesisPeriodMutationData) => {
    try {
      setIsUpdating(true);
      await ThesisPeriodService.update(id, data);
      toast({ title: 'Thành công', description: 'Cập nhật đợt khóa luận thành công' });
      onSuccess?.();
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể cập nhật đợt khóa luận', variant: 'destructive' });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteThesisPeriod = async (id: number): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await ThesisPeriodService.delete(id);
      toast({ title: 'Thành công', description: 'Xóa đợt khóa luận thành công' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa đợt khóa luận', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const softDeleteThesisPeriods = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await ThesisPeriodService.bulkSoftDelete(ids);
      toast({ title: 'Thành công', description: 'Xóa tạm thời các đợt khóa luận thành công.' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa tạm thời các đợt khóa luận', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const restoreThesisPeriods = async (ids: number[]): Promise<boolean> => {
    try {
      setIsRestoring(true);
      await ThesisPeriodService.bulkRestore(ids);
      toast({ title: 'Thành công', description: 'Khôi phục đợt khóa luận thành công' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể khôi phục đợt khóa luận', variant: 'destructive' });
      return false;
    } finally {
      setIsRestoring(false);
    }
  };

  const permanentDeleteThesisPeriods = async (ids: number[]): Promise<boolean> => {
    try {
      setIsDeleting(true);
      await ThesisPeriodService.bulkPermanentDelete(ids);
      toast({ title: 'Thành công', description: 'Xóa vĩnh viễn đợt khóa luận thành công' });
      onSuccess?.();
      return true;
    } catch (error) {
      toast({ title: 'Lỗi', description: error instanceof Error ? error.message : 'Không thể xóa vĩnh viễn đợt khóa luận', variant: 'destructive' });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createThesisPeriod,
    updateThesisPeriod,
    deleteThesisPeriod,
    softDeleteThesisPeriods,
    restoreThesisPeriods,
    permanentDeleteThesisPeriods,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring,
  };
} 